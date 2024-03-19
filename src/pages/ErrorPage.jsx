import React from 'react'
import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()


  return (
    <div>
      <h1>Oops!</h1>
      <p>Something wrong!</p>
    </div>
  )
}
