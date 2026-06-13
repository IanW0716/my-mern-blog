import { lazy, Suspense } from "react";
import Layout from "./Layout.jsx";
import {Route, Routes} from "react-router-dom";
import IndexPage from "./pages/IndexPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import {UserContextProvider} from "./UserContext.jsx";
import { SpeedInsights } from '@vercel/speed-insights/react';

const CreatePost = lazy(() => import("./pages/CreatePost.jsx"));
const PostPage = lazy(() => import("./pages/PostPage.jsx"));
const EditPost = lazy(() => import("./pages/EditPost.jsx"));

function App() {
  return (
      <>
          <UserContextProvider>
              <Suspense fallback={<div className="text-center py-20 text-gray-500">页面加载中...</div>}>
                  <Routes>
                      <Route path={'/'} element={<Layout/>}>
                          <Route index element={<IndexPage/>} />
                          <Route path={'/login'} element={<LoginPage/>}/>
                          <Route path={'/register'} element={<RegisterPage/>}/>
                          <Route path={'/post'} element={<CreatePost/>}/>
                          <Route path={'/post/:id'} element={<PostPage/>}/>
                          <Route path={'/edit/:id'} element={<EditPost/>}/>
                      </Route>
                  </Routes>
              </Suspense>
          </UserContextProvider>
          <SpeedInsights />
      </>
  )
}

export default App