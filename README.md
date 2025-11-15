# Smart Wallet

## Table of contents

-  [How to run?](#how-to-run)

## How to run?

1. Fork the repository to your github account.

2. Clone the repository.
```bash
git clone https://github.com/YOUR_USERNAME/smart-wallet.git
```

3. Create a MongoDB database (MongoDB Atlas) and import the data in the [sample_data](./sample_data) folder.

4. Replace `YOUR_SECRET` placeholder in below `.env` files with your credentials.
    - [api-gateway/.env](api-gateway/.env)
    - [user-service/.env](user-service/.env)
    - [finops-service/.env](finops-service/.env)
    - [notification-service/.env](notification-service/.env)
    - [frontend/.env](frontend/.env)

5. Run below command in the root directory to install dependencies. 
```bash
npm run install-all
```

6. Run below command to start backend.
```bash
npm run start-backend
```

7. Run below command to start frontend.
```bash
npm run start-frontend
```
