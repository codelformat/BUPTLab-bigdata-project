from elasticsearch import Elasticsearch

# 连接到 Elasticsearch
es = Elasticsearch([{'scheme': 'http', 'host': 'localhost', 'port': 9200}])

# 创建索引
index_name = 'arxiv'

# 索引设置和映射
settings = {
    "mappings": {
        "properties": {
            "id": {"type": "keyword"},      # id 映射为 keyword 类型
            "authors": {"type": "text"},
            "title": {"type": "text"},
            "abstract": {"type": "text"}
        }
    }
}

# 创建索引
es.indices.create(index=index_name, body=settings, ignore=400)
print(f"Index '{index_name}' created successfully!")