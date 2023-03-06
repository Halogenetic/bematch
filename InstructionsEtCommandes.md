# INSTRUCTIONS
    - MySQL : DATABASE_URL="mysql://root:azerty123@localhost:3306/bematch"
        - Password : azerty123
        - Hostname: localhost
        - Post: 3306
        - Username : root
        - Schema : bematch

# COMMANDES
    - npm install
    - Prisma migration :
        npx prisma migrate dev --name init
    - npm run dev