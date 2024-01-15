echo '\n\n Requesting all heroes'
curl localhost:3000/heroes

echo '\n\n Requesting a hero with id 1'
curl localhost:3000/heroes/1

echo '\n\n Requesting with wrong body'
curl --silent -X POST \
  --data-binary '{"invalid": "data"}' \
  localhost:3000/heroes

echo '\n\n Creating Moly'
CREATE=$(curl --silent -X POST \
  --data-binary '{"name": "Moly", "age": 26, "power": "agilidade"}' \
  localhost:3000/heroes)

echo $CREATE

# link para o jq -> https://jqlang.github.io/jq/download/
# ID=$(echo $CREATE | jq .id)
# echo $ID

# echo '\n\n Requesting Moly'
# curl localhost:3000/heroes/$ID