
import React, {useState, useRef, useMemo, useEffect} from "react";
import ClassCounter from "../components/classCounter";
import Counter from "../components/counter";
import PostFilter from "../components/PostFilter"
import PostForm from "../components/PostForm";
import PostItem from "../components/postItem"
import PostList from "../components/PostList";
import "../components/styles/app.css"
import MyButton from "../components/UI/button/MyButton";
import MyInput from "../components/UI/input/MyInput";
import MySelect from "../components/UI/select/MySelect";
import MyModal from "../components/UI/MyModal/MyModal";
import { usePosts } from "../hooks/usePosts";
import axios from "axios";
import PostService from "../API/PostService";
import Loader from "../components/UI/Loader/Loader";
import { useFetching } from "../hooks/useFetching";
import { getPageCount } from "../utils/pages";
import { getPagesArray } from "../utils/pages";
import Pagination from "../components/UI/Pagination/Pagination";
import { useObserver } from "../hooks/useObserver";

function Posts() {
  const [posts, setPosts] = useState([]);
  //   {id: 1, title: "JavaScript", body: "fow frontend"},
  //   {id: 2, title: "Python", body: "for all"},
  //   {id: 3, title: "PHP", body: "many users"},
  //   {id: 4, title: "C++", body: "OOP"},
  //   {id: 5, title: "C#", body: "for game dev"}
  // ])



// Получение данных из НЕуправляемого инпута
// const bodyInputRef = useRef()



// Получение данных из управляемого инпута

const createPost = (newPost) => {
  setPosts([...posts, newPost]);
  setModal(false)
}
//Получаем пост из дочернего компонента
const removePost = (post) => {
  setPosts(posts.filter(p => p.id !== post.id))
}

const [filter, setFilter] = useState({sort: "", query: ""})
const [modal, setModal] = useState(false);
const [totalPages, setTotalPages] = useState(0)
const [limit, setLimit] = useState(10)
const [page, setPage] = useState(1)
const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)
const lastElement = useRef();




const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
  const response = await PostService.getAll(limit, page);
  setPosts([...posts, ...response.data]);
  const totalCount = response.headers["x-total-count"]
  setTotalPages(getPageCount(totalCount, limit))
})

useObserver(lastElement, page < totalPages, isPostsLoading, () =>{
  setPage(page + 1)
})

useEffect(() => {
  fetchPosts(limit, page)
}, [page, limit]);


const changePage = (page) => {
  setPage(page)
  
  
}




//  Управляемый компонент
  return (
    <div className="App">
    
    <MyButton style={{marginTop: "30px"}} onClick={() => setModal(true)}>
      Создать пост
    </MyButton>
    <MyModal visible={modal} setVisible={setModal}>
    <PostForm create={createPost} />
    </MyModal>
    
    <hr style={{margin: "15px 0"}}/>
    <PostFilter filter={filter} 
      setFilter={setFilter}
    />
    <MySelect 
      value={limit}
      onChange={value => setLimit(value)}
      defaultValue="количество элементов нв странице"
      options={[
        {value: 5, name: "5"},
        {value: 10, name: "10"},
        {value: 25, name: "25"},
        {value: -1, name: "Показать все"},
      ]}
    />
    {postError &&
        <h1>Error ${postError}</h1>
    }
    <PostList remove={removePost} posts={sortedAndSearchedPosts} title="Про JS"/>
    <div ref={lastElement} style={{height: 20}}/>
    {isPostsLoading &&
      <div style={{display: "flex", justifyContent: "center", marginTop: "50px"}}><Loader /></div>
    }  
      
    
    <Pagination 
      page={page}
      changePage={changePage}
      totalPages={totalPages}
    />
    </div>
  );
}

export default Posts;