from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_community.vectorstores import FAISS
import openai
import torch
import gc
from typing import Optional

class SharedResources:
    # 静态变量声明
    _embeddings: Optional[HuggingFaceBgeEmbeddings] = None
    _vector_store: Optional[FAISS] = None
    _client: Optional[openai.OpenAI] = None
    _initialized: bool = False
    
    def __init__(self):
        if not SharedResources._initialized:
            SharedResources._initialize()
    
    @classmethod
    def _initialize(cls) -> None:
        """初始化所有共享资源"""
        if cls._initialized:
            return
            
        try:
            # 清理 GPU 内存
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
                torch.backends.cudnn.benchmark = True
            
            # 初始化 embedding model
            model_kwargs = {
                "device": "cuda",
                # "use_fp16": True,
                # "torch_dtype": torch.float16,
                # "max_memory": {0: "16GB"}
            }
            encode_kwargs = {
                "normalize_embeddings": True,
                # "batch_size": 8
            }
            
            cls._embeddings = HuggingFaceBgeEmbeddings(
                model_name="../shared_models/BAAI/bge-m3",
                model_kwargs=model_kwargs,
                encode_kwargs=encode_kwargs
            )
            
            # 初始化 vector store
            cls._vector_store = FAISS.load_local(
                "../arxiv_vector_store_cs",
                cls._embeddings,
                allow_dangerous_deserialization=True
            )
            
            # 初始化 OpenAI client
            cls._client = openai.OpenAI(
                api_key="c4ed4d9021634ba2a992fe155b0eb65c",
                base_url="https://api.lingyiwanwu.com/v1"
            )
            
            cls._initialized = True
            
        except Exception as e:
            print(f"初始化失败: {str(e)}")
            raise
    
    @classmethod
    def clear_gpu_memory(cls) -> None:
        """清理 GPU 内存"""
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            gc.collect()
    
    # Getter 方法
    @property
    def embeddings(self) -> HuggingFaceBgeEmbeddings:
        return self._embeddings
    
    @property
    def vector_store(self) -> FAISS:
        return self._vector_store
    
    @property
    def client(self) -> openai.OpenAI:
        return self._client
    
    @property
    def remote_model_name(self) -> str:
        return "yi-lightning"