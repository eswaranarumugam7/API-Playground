# Example API Requests

Test these example requests in the API Response Playground:

## 1. GET Request - Fetch a Post
```
URL: https://jsonplaceholder.typicode.com/posts/1
Method: GET
Headers: (none required)
```

## 2. POST Request - Create a Post
```
URL: https://jsonplaceholder.typicode.com/posts
Method: POST
Headers: 
  - Content-Type: application/json
Body:
{
  "title": "My New Post",
  "body": "This is the content of my post",
  "userId": 1
}
```

## 3. PUT Request - Update a Post
```
URL: https://jsonplaceholder.typicode.com/posts/1
Method: PUT
Headers:
  - Content-Type: application/json
Body:
{
  "id": 1,
  "title": "Updated Post Title",
  "body": "Updated post content",
  "userId": 1
}
```

## 4. DELETE Request - Delete a Post
```
URL: https://jsonplaceholder.typicode.com/posts/1
Method: DELETE
Headers: (none required)
```

## 5. GET Request - Fetch Users
```
URL: https://jsonplaceholder.typicode.com/users
Method: GET
Headers: (none required)
```

## 6. Real API Example - GitHub User
```
URL: https://api.github.com/users/octocat
Method: GET
Headers:
  - User-Agent: API-Response-Playground
```

## Notes:
- JSONPlaceholder is a fake REST API for testing and prototyping
- All requests return mock data, but demonstrate real HTTP behavior
- The GitHub API example shows a real API response
- Try different URLs and observe response times, status codes, and headers