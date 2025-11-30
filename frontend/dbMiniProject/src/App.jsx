import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { HomePage } from "./pages/homePage/HomePage"
import { DetailNovel } from "./pages/detailNovel/DetailNovel"
import { Login } from "./pages/login/Login"
import { Register } from "./pages/register/Register"
import { MyPage } from "./pages/mypage/MyPage"
import { BadgePage } from "./pages/badge/badgePage"
import { CollectionDetail } from "./pages/collection/CollectionDetail"
import { CollectionListPage } from "./pages/collections/CollectionListPage"
import { ReviewFeedPage } from "./pages/reviews/ReviewFeedPage"
import { AuthorListPage } from "./pages/authors/AuthorListPage"
import { AuthorProfilePage } from "./pages/authors/AuthorProfilePage"
import { UserProfilePage } from "./pages/user/UserProfilePage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/detail/:id' element={<DetailNovel/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/mypage' element={<MyPage/>} />
        <Route path='/badge' element={<BadgePage/>} />
        <Route path='/collections' element={<CollectionListPage/>} />
        <Route path='/collection/:id' element={<CollectionDetail/>} />
        <Route path='/reviews' element={<ReviewFeedPage/>} />
        <Route path='/authors' element={<AuthorListPage/>} />
        <Route path='/author/:userId' element={<AuthorProfilePage/>} />
        <Route path='/user/:userId' element={<UserProfilePage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
