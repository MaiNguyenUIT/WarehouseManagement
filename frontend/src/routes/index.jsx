import { Fragment } from "react"
import LoginPage from "../../App/Login/page"
import React from "react"

const publicRoutes = [
    {
      path: "/login" ,
      layout: Fragment,
      component: <LoginPage/>,
    },
  ]
  export { publicRoutes }