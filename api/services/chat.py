from typing import Optional
import openai
from .shared_resources import SharedResources

class ChatService:
    def __init__(self):
        resources = SharedResources()
        self.client = resources.client
        self.remote_model_name = resources.remote_model_name
        self.vector_store = resources.vector_store
        
    async def chat(self, message: str) -> str:
        # 1. 提取关键词
        keywords = await self.rephrase_query(message)
        
        # 2. 根据关键词搜索相关文档
        results = self.vector_store.similarity_search_with_score(
            keywords,
            k=10
        )
        
        # 准备chunks和metadata
        chunks = []
        metadata = []
        for doc, score in results:
            chunks.append(doc.page_content)
            metadata.append(f"Score: {score:.4f}")
        
        # 3. 生成回复
        answer = await self.process_rag_results(message, chunks, metadata)
        
        return answer

    async def rephrase_query(self, query: str) -> str:
        """将用户查询转换为适合arxiv的关键词"""
        response = self.client.chat.completions.create(
            model=self.remote_model_name,
            messages=[
                {
                    "role": "system",
                    "content": "You are a key information extractor and always respond with only one most relevant keyword or key phrase from the input for use in a search engine query. Focus on essential terms and maintain the original wording."
                },
                {"role": "user", "content": query}
            ]
        )
        return response.choices[0].message.content.strip()
    
    async def process_rag_results(self, query, chunks, metadata=None):
        """处理RAG结果并生成回答"""
        # 构建上下文
        context = []
        for i, chunk in enumerate(chunks):
            source = f"Source {i+1}"
            if metadata and i < len(metadata):
                source = metadata[i]
            context.append(f"{source}: {chunk}")
        
        context_str = "\n\n".join(context)
        
        # 生成回答
        response = self.client.chat.completions.create(
            model=self.remote_model_name,
            messages=[
                {
                    "role": "system",
                    "content": "You are an academic assistant. Please answer the question based on the provided literature fragments. When answering, please cite the source of the information."
                },
                {
                    "role": "user",
                    "content": f"Question: {query}\n\nContext:\n{context_str}"
                }
            ]
        )
        return response.choices[0].message.content