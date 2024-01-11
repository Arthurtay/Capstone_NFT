# Capstone_NFT
Capstone NFT using react,nodejs,postgresql and hardhat

# Video Demo running project and Token transfer
https://youtu.be/uhs9jGADnTo

# Requirement 
1.MetaMask browser extention <br/>
2.npm install in  node-api-postgres folder <br/>
3.npm install in  blockchain folder <br/>

# How to run the Project
Steps to start up node js server <br/>
Open a Terminal <br/>
1.cd node-api-postgres <br/>
2.node index.js <br/>

Open a 2nd Terminal <br/>
Steps to boot up blockchain <br/>
1.cd telemed-hardhat <br/>
Boot up local development blockchain ( get the accounts) <br/>
2.npx hardhat node <br/>

Open a 3rd Terminal <br/>
Migrate and compile smart contracts <br/>
3.cd telemed-hardhat <br/>
4.npx hardhat run src/backend/scripts/deploy.js --network localhost <br/>

Launch Frontend <br/>
5.npm run start <br/>
