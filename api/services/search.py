from typing import List
import torch
from .shared_resources import SharedResources
import uuid

from models.schemas import SearchResult

class SearchService:
    def __init__(self):
        resources = SharedResources()
        self.vector_store = resources.vector_store
        self.reranker_model = resources.reranker_model
        self.es = resources.es
        # 初始化重排序模型
        # self.reranker_tokenizer = AutoTokenizer.from_pretrained("BAAI/bge-reranker-large")
        # self.reranker_model = FlagReranker("BAAI/bge-reranker-large", use_fp16=True)

    async def search(self, query: str) -> List[SearchResult]:
        # 1. 使用向量搜索找到前10个结果
        results = self.vector_store.similarity_search_with_score(query, k=5)
        
        # 2. 使用ES搜索找到前5个结果
        es_query = {
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": ["abstract", "authors", "title", "id"]
                }
            },
            "size": 5,
            "sort": [
                {
                    "_score": {"order": "desc"}
                }
            ]
        }
        
        ## TODO: 表格式字段
        def format_text(item):
            return f"Title: {item['_source']['title']}\nAuthor: {item['_source']['authors']}\nAbstract: {item['_source']['abstract']}\nURL: https://arxiv.org/pdf/{item['id']}"
        
        es_results = self.es.search(index="arxiv", body=es_query).map(lambda x: format_text(x["hits"]["hits"][0]["_source"]))
        
        results.extend(es_results)
        
        # 3. 使用重排序模型重新排序
        reranked_results = self.rerank_results(query, results)
        
        # 4. 返回前5个结果
        return [
            SearchResult(
                id=str(uuid.uuid4()),
                title=doc.metadata.get("title", ""),
                content=doc.page_content,
                url=doc.metadata.get("url", ""),
                relevanceScore=score
            )
            for doc, score in reranked_results[:5]
        ]
    
    def rerank_results(self, query, results):
        pairs = [(query, doc.page_content) for doc, _ in results]
        
        with torch.no_grad():
            scores = self.reranker_model.compute_scores(pairs)
        
        # 将分数与文档配对并排序
        scored_results = [(doc, float(score)) for (doc, _), score in zip(results, scores)]
        return sorted(scored_results, key=lambda x: x[1], reverse=True)