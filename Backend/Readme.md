**Testing Documentation for Chat App Backend**

1. **Running the App**:
   - Ensure that Node.js and npm are installed on your system.
   - Clone the repository containing the backend code for the chat application.
   - Navigate to the project directory in your terminal.
   - Install dependencies using the command: `npm install`.
   - Start the backend server using: `npm start`.

2. **User Registration**:
   - **URL**: `POST /register`
   - **Method**: POST
   - **Request JSON**:
     ```json
     {
       "name": "John Doe",
       "userId": "johndoe123",
       "phoneNumber": "+1234567890",
       "email": "johndoe@example.com",
       "password": "password123",
     }
     ```
   - **Expected Response**:
     - Status: 201 Created
     - Content:
       ```json
       {
         "message": "User registered successfully"
       }
       ```

3. **User Login**:
   - **URL**: `POST /login`
   - **Method**: POST
   - **Request JSON**:
     ```json
     {
       "userId": "johndoe123",
       "password": "password123"
     }
     ```
   - **Expected Response**:
     - Status: 200 OK
     - Content:
       ```json
       {
         "message": "Login successful",
         "fcmToken": "<valid FCM token>"
       }
       ```

4. **Sending Message**:
   - **URL**: `POST /send-message`
   - **Method**: POST
   - **Request JSON**:
     ```json
     {
       "senderUserId": "johndoe123",
       "receiverUserId": "janedoe456",
       "message": "Hello Jane, how are you?"
     }
     ```
   - **Expected Response**:
     - Status: 201 Created
     - Content:
       ```json
       {
         "message": "Message sent successfully"
       }
       ```

5. **Reading Messages**:
   - **URL**: `GET /messages`
   - **Method**: GET
   - **Query Parameters**:
     - `senderUserId`: johndoe123
     - `receiverUserId`: janedoe456
   - **Expected Response**:
     - Status: 200 OK
     - Content: Array of message objects

6. **Sending FCM Token**:
   - **URL**: `POST /updatefcm`
   - **Method**: POST
   - **Request JSON**:
     ```json
     {
       "userId": "johndoe123",
       "fcmToken": "token",

     }
     ```
   - **Expected Response**:
     - Status: 201 Created
     - Content:
       ```json
       {
         "message": "FCM token updated successfully"
       }
       ```

### User List API

- **URL**: `GET /userlist`
- **Method**: GET
- **Query Parameters**:
  - `userId`: The ID of the user for which the user list is requested.
- **Expected Response**:
  - **Status**: 200 OK
  - **Content**: Depending on the user's role:
    - If the user is an admin, the response will include all user IDs.
    - If the user is not an admin, the response will include only admin user IDs.




http://localhost:3000/user-list?userId=yourUserId