# INSTRUCTIONS
    Configurer l'URL de la database :
    - DATABASE_URL="mongodb+srv://user:password@cluster0.wtz5zp1.mongodb.net/%3FretryWrites=true&w=majority"



# COMMANDES
    Installer les dépendances :
    - npm install

    Ajouter les models dans la database :
    - npx prisma generate
    - npx prisma db push

    Lancer le projet en développement à l'url: http://localhost:3000
    - npm run dev

    Fermer le port:3000 s'il est utilisé :
    - sudo kill -9 $(sudo lsof -t -i:3000)