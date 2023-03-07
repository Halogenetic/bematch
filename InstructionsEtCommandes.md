# INSTRUCTIONS
    Configurer l'URL de la database :
    - DATABASE_URL="mongodb+srv://user:password@cluster0.wtz5zp1.mongodb.net/%3FretryWrites=true&w=majority"



# COMMANDES
    Ajouter les models dans la database :
    - npx prisma generate
    - npx prisma db push

    Lancer le projet en développement à l'url: http://localhost:3000
    - npm run dev