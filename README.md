# Capstone_NFT
Capstone NFT using hardhat

#Video Demo running project and Token transfer


#Requirement
1.MetaMask browser extention
2.npm install in  node-api-postgres folder
3.npm install in  blockchain folder

# How to run the Project
Steps to start up node js server
Open a Terminal
1.cd node-api-postgres
2.node index.js

Open a 2nd Terminal 
Steps to boot up blockchain
1.cd telemed-hardhat
Boot up local development blockchain ( get the accounts)
2.npx hardhat node

Open a 3rd Terminal
Migrate and compile smart contracts
3. cd telemed-hardhat
4.npx hardhat run src/backend/scripts/deploy.js --network localhost
Launch Frontend
5.npm run start
