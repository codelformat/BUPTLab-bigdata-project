from elasticsearch import Elasticsearch

# 连接到 Elasticsearch
es = Elasticsearch([{'scheme': 'http', 'host': 'localhost', 'port': 9200}])

# 表名称
index_name = 'arxiv'

# 查询语句
query = {
    "query": {
        "multi_match": {
            "query": "quantum mechanics",  # 问题在这里修改
            "fields": ["id", "author", "title", "abstract"]  # 查询的四个字段
        }
    },
    "size": 10,  # 返回前 10 个结果
    "sort": [
        {"_score": {"order": "desc"}}  # 按匹配度（_score）降序排序
    ]
}


# 执行搜索请求
response = es.search(index=index_name, body=query)

# 输出结果
print("Top 10 matching documents:")
for hit in response['hits']['hits']:
    print(f"ID: {hit['_id']}, Score: {hit['_score']}, Title: {hit['_source']['title']}, URL: https://arxiv.org/pdf/{hit['_id']}")
