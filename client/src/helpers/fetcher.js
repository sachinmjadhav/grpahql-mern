const fetcher = (requestBody, token = null) => fetch("http://localhost:3001/graphql", {
  method: "POST",
  body: JSON.stringify(requestBody),
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  }
})

export default fetcher;