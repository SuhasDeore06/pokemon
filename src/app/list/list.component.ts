import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  pokemonDetails: {
    name: any;
    url: any;
    id: number;
    image: any;
    species: {
      url: {
        flavor_text_entries: {
          flavor_text: any;
        };
        egg_groups: {
          name: any;
        };
      };
    };
    types: {
      type: {
        name: string;
      };
    }[];
    sprites: {
      other: {
        dream_world: {
          front_default: any;
        };
      };
    };
    backgroundColor: string;
  }[] = [];
  information: any;
  identity: any;
  surround: any;
  fetchpokemonDetails: any[] = [];
  selectedPokemon: any;
  isPopupOpen: boolean = false;
  image: any;
  evolutionChain: {
    dataName: any;
    dataId: any;
    dataBackgroundColor: any;
    dataImage: any;
  }[] = [];
  data: any;
  currentPage: number = 1;
  pageSize: number = 10;
  isTemplatePopupOpen: any;
  router: any;
  selectdButton: any;
  isNewPopup: boolean = false;
  templateArray: any[] = [];
  reactiveForm: FormGroup | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllData();
  }

  totalPages() {
    let pages = Math.ceil(this.pokemonDetails.length / this.pageSize);
    return pages;
  }

  //template driven from
  getTemplateData(templateFormData: any): any {
    console.log(templateFormData, 'formdata');

    const newPokemon = {
      name: templateFormData.name,
      url: '',
      id: this.pokemonDetails.length + 1,
      image: '',
      height: templateFormData.height,
      weight: templateFormData.weight,
      abilities: [{ ability: { name: templateFormData.abilities } }],
      weakAgainst: templateFormData.weakAgainst,
      species: {
        url: {
          flavor_text_entries: {
            flavor_text: templateFormData.para,
          },
          egg_groups: {
            name: templateFormData.eggGroup,
          },
        },
      },
      types: [{ type: { name: templateFormData.type } }],
      sprites: {
        other: {
          dream_world: {
            front_default: 'assets/images/hattori.jpg',
          },
        },
      },
      backgroundColor: `linear-gradient(to bottom, #CBD5ED,#FCC1B0)`,
      stats: {
        0: { stat: { name: templateFormData.hp } },
        1: { stat: { name: templateFormData.attack } },
        2: { stat: { name: templateFormData.defence } },
        3: { stat: { name: templateFormData.speed } },
        4: { stat: { name: templateFormData.spAttack } },
        5: { stat: { name: templateFormData.spDef } },
      },
    };

    this.pokemonDetails.unshift(newPokemon);

    console.log(this.pokemonDetails, 'pokemonDetails array');
  }

  //reactive form
  reactivePokemonForm = new FormGroup({
    name: new FormControl(''),
    // sprites: new FormGroup({
    //   other: new FormGroup({
    //     dream_world: new FormGroup({
    //       front_default: new FormControl('assets/images/dorarmon.jpg'),
    //     }),
    //   }),
    // }),
    paragraph: new FormControl(''),
    height: new FormControl(''),
    weight: new FormControl(''),
    gender: new FormControl(''),
    eggGroup: new FormControl(''),
    abilities: new FormControl(''),
    weakAgainst: new FormControl(''),
    hp: new FormControl(''),
    attack: new FormControl(''),
    defence: new FormControl(''),
    speed: new FormControl(''),
    spAttack: new FormControl(''),
    spDef: new FormControl(''),
  });

  submittedData: any[] = [];

  reactiveFormLogin() {
    console.log(this.reactivePokemonForm.value);
    this.pokemonDetails.unshift(this.reactiveForm?.value);
  }

  // entryForm = new FormGroup({
  //   user: new FormControl(''),
  //   identity: new FormControl(''),
  // });

  // submittedData: any[] = [];

  // entryData() {
  //   const formData = this.entryForm.value;
  //   this.submittedData.push(formData);
  //   console.log(this.submittedData, 'list');

  // const newPokemonList = {
  //   name: formData.user,
  //   url: '',
  //   id: this.pokemonDetails.length + 1,
  //   image: 'assets/image/hattori.jpg',
  //   species: {
  //     url: {
  //       flavor_text_entries: {
  //         flavor_text: '',
  //       },
  //       egg_groups: {
  //         name: '',
  //       },
  //     },
  //   },
  //   types: [],
  //   sprites: {
  //     other: {
  //       dream_world: {
  //         front_default: 'assets/images/dorarmon.jpg',
  //       },
  //     },
  //   },
  //   backgroundColor: `#C7D7DF`,
  //   stats: {
  //     stat: {
  //       name: '',
  //     },
  //   },
  // };

  // this.pokemonDetails.push(newPokemonList);
  // console.log(this.pokemonDetails, 'new-details');
  // console.log(newPokemonList, 'newPokemonList');
  // }

  fetchAllData() {
    //for Name
    this.http
      .get('https://pokeapi.co/api/v2/pokemon?limit=36')
      .subscribe((response: any) => {
        console.log(response);
        this.pokemonDetails = response.results;
        console.log(this.pokemonDetails, '1st data');

        //for ID
        const results = this.pokemonDetails.map((pokemon) =>
          this.http.get(pokemon.url)
        );
        console.log(results, '2nd data');

        //for images. forkjoin is used to fetch data of multiple url's.
        forkJoin(results).subscribe((response: any[]) => {
          this.pokemonDetails = response;
          this.pokemonDetails.forEach((entry: any) => {
            entry.response;
          });
          console.log(response, '3rd data');

          this.precalculateColors();

          this.pokemonDetails.forEach((entry: any) => {
            this.evolutionChain.push({
              dataName: entry.name, // Name
              dataId: entry.id, // ID
              dataBackgroundColor: entry.backgroundColor, // Background color
              dataImage: entry.sprites.other.dream_world.front_default, // Image
            });
          });

          //console.log(this.evolutionChain, 'evchain');
          this.data = this.evolutionChain;
          console.log(this.data, 'evchain');
        });
      });
    console.log(this.fetchAllData, 'fecthdata');
  }

  precalculateColors(): void {
    const typeColors: { [key: string]: string } = {
      normal: '#DDCBD0',
      rock: '#C5AEA8',
      water: '#CBD5ED',
      dragon: '#CADCDF',
      fighting: '#FCC1B0',
      bug: '#C1E0C8',
      grass: '#C0D4C8',
      dark: '#C6C5E3',
      flying: '#B2D2E8',
      ghost: '#D7C2D7',
      electric: '#E2E2A0',
      fairy: '#E4C0CF',
      poison: '#CFB7ED',
      steel: '#C2D4CE',
      psychic: '#DDC0CF',
      unknown: '#C0DFDD',
      ground: '#F4D1A6',
      fire: '#EDC2C4',
      ice: '#C7D7DF',
      shadow: '#CACACA',
    };

    this.pokemonDetails.forEach((pokemon) => {
      const primaryType = pokemon.types[0]?.type?.name;
      const secondaryType =
        pokemon.types.length > 1 ? pokemon.types[1]?.type?.name : null;
      const primaryColor = typeColors[primaryType] || '#FFFFFF';
      const secondaryColor = secondaryType
        ? typeColors[secondaryType]
        : typeColors[primaryType];
      pokemon.backgroundColor = `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`;
    });
  }

  openPopup(pokemon: any) {
    this.selectedPokemon = pokemon;

    // const rect = (event.target as HTMLElement).getBoundingClientRect();
    // this.selectedPokemon.popupPosition = {
    //   top: rect.top + window.scrollX,
    //   left: rect.left + window.scrollY,
    // };
    //openPopup(pokemon: any, event: MouseEvent)
    this.isPopupOpen = true;
    console.log(this.selectedPokemon, 'this.selectedPokemon');
    console.log(this.selectedPokemon.types, 'hello');
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  paginationFunction(value: any) {
    if (value === 0 && this.currentPage > 1) {
      this.currentPage--;
    } else if (value === 1 && this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  getPokemonForPage(page: number): any[] {
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.pokemonDetails.slice(startIndex, endIndex);
  }
}
