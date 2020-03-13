const pokedex  = document.getElementById("pokedex");
const card = document.getElementsByClassName("card");
const searchInput = document.getElementById("myInput");
const cache = {};

searchInput.addEventListener("keyup", mySearchFunction);
searchInput.addEventListener("change", mySearchFunction);

function mySearchFunction() {
    let filter, ul, li, item, i, txtValue;
    filter = searchInput.value.toUpperCase();
    ul = document.getElementById("pokedex");
    li = ul.getElementsByTagName("li");  for (i = 0; i < li.length; i++) {
      item = li[i];
      txtValue = item.textContent || item.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

const fetchPokemon = async() => {
    const url = "https://pokeapi.co/api/v2/pokemon?limit=800";
    const res = await fetch(url);
    const data = await res.json();
    const pokemon = data.results.map((result, index) => ({
        ...result,
        id: index + 1,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
        apiURL: result.url
    }));
    displayPokemon(pokemon);
};

const displayPokemon = (pokemon) => {
    const pokemonHTMLString = pokemon.map(individualPokemon => `
        <li class="card" onclick="selectPokemon(${individualPokemon.id})">
            <img class="card-image" src="${individualPokemon.image}"/>
            <h2 class="card-title">${individualPokemon.id}. ${individualPokemon.name}</h2>
        </li>
    `
    ).join("");
    pokedex.innerHTML = pokemonHTMLString;
}

const selectPokemon = async(id) => {
    if(!cache[id]){
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        const descurl = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
        const res = await fetch(url);
        const res1 = await fetch(descurl);
        const individualPokemon = await res.json();
        const pokemonDesc = await res1.json();
        console.log(individualPokemon);
        console.log(pokemonDesc);
        // cache[id] = individualPokemon;
        // cache[id] = pokemonDesc;
        displayPopup(individualPokemon,pokemonDesc);
    }
    else{
        displayPopup(cache[id], cache[id]);
    }
};
const displayPopup = async(individualPokemon,pokemonDesc) => {
    const poketype = individualPokemon.types.map(type => type.type.name).join(",");
    const pokeability = individualPokemon.abilities.map(ability => ability.ability.name).join(",");
    const pokeDesc = pokemonDesc.flavor_text_entries.filter(function(o){
        return o.language.name == "en";
    });
    const description = pokeDesc.slice(1,2);
    const pokeDescMain = description.map(desc => desc.flavor_text).join("");
    const image = individualPokemon.sprites["front_default"];
    const htmlString = `
        <div class="popup">
            <button id="closeBtn" onclick="closePopup()">Close</button>
            <div class="card">
                <img class="card-image" src="${image}"/>
                <h2 class="card-title">${individualPokemon.id}. ${individualPokemon.name}</h2>
                <h4 class="card-desc">${pokeDescMain}</h2>
                <p><small>Height: </small>${individualPokemon.height * 10} cm | <small>Weight: </small>${individualPokemon.weight / 10} kg | <small>Type: </small>${poketype}
                <p><small>Abilities: </small>${pokeability}</p>
            </div>
        </div>
    `;
    pokedex.innerHTML = htmlString + pokedex.innerHTML;
};
 
const closePopup = () => {
    const popup = document.querySelector(".popup");
    popup.parentElement.removeChild(popup);
}

fetchPokemon();