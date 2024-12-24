import json
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

# 连接到 Elasticsearch
es = Elasticsearch([{'scheme': 'http', 'host': 'localhost', 'port': 9200}])

# 定义索引名称
index_name = "arxiv"

# 定义文件路径
file_path = "/root/datasets/arxiv-metadata-oai-snapshot.json"

# 批量操作的文档列表
bulk_data = []

# 打开 JSON 文件并逐行读取
with open(file_path, 'r', encoding='utf-8') as file:
    for line in file:
        # 将每一行解析为 JSON 对象
        record = json.loads(line.strip())

        # 提取需要的字段
        document = {
            "_index": index_name,
            "_source": {
                "id": record.get("id", None),
                "authors": record.get("authors", None),
                "title": record.get("title", None),
                "abstract": record.get("abstract", None)
            }
        }

        # 将文档添加到批量列表中
        bulk_data.append(document)

        # 每 10000 条文档执行一次批量插入
        if len(bulk_data) >= 10000:
            bulk(es, bulk_data)
            bulk_data = []  # 清空批量列表

    # 插入剩余的文档
    if bulk_data:
        bulk(es, bulk_data)
