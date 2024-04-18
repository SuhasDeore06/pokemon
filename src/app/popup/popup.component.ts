import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent implements OnInit {
  @Input() openPage: any;
  @Input() selectedPokemon: any;
  @Input() isPopupOpen: boolean = false;
  @Output() closePopup: EventEmitter<any> = new EventEmitter();
  @Input() pokemonEvolutionChain: any[] = [];
  @Input() allNames: any[] = []; //to fetch popupcontent in evolution in html
  @Input() fetchEvolutionData: any;

  backgroundColor: string = '';
  pokemonDetails: string = '';
  mainTask: any;
  subTask: any;
  pokemonEggGroup: any;
  spritesElement: any[] = [];
  evolutionChain: any;
  attempt: any;
  //allNames: string[] = [];
  //pokemonEvolutionChain: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.selectedPokemon && !changes.selectedPokemon.firstChange) {
  //     console.log('selectedPokemon', this.selectedPokemon);
  //     const newValue = changes.selectedPokemon.currentValue;
  //     if (newValue) {
  //       console.log(newValue, 'newValue');
  //       let speciesUrl = newValue.species.url;
  //       if (speciesUrl) {
  //         console.log(speciesUrl, 'speciesURL');
  //         this.fetchSpeciesDetails(speciesUrl);
  //       }
  //     }
  //   }
  // }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedPokemon && !changes.selectedPokemon.firstChange) {
      console.log('selectedPokemon', this.selectedPokemon);
      const newValue = changes.selectedPokemon.currentValue;
      if (newValue && typeof newValue.species.url === typeof '') {
        console.log(newValue, 'newValue');
        let speciesUrl = newValue.species.url;
        if (speciesUrl) {
          console.log(speciesUrl, 'speciesURL');
          this.fetchSpeciesDetails(speciesUrl);
        }
      } else {
        this.pokemonDetails =
          newValue.species.url.flavor_text_entries.flavor_text;
        console.log(
          newValue.species.url.flavor_text_entries.flavor_text,
          'para-val'
        );
      }
    }
  }

  onClosePopup() {
    this.closePopup.emit();
  }

  fetchSpeciesDetails(url: any) {
    // if (url === '') {
    //   this.selectedPokemon.species.url.flavor_text_entries.flavor_text;
    //   console.log(
    //     this.selectedPokemon.species.url.flavor_text_entries.flavor_text,
    //     'testing'
    //   );

    //   return;
    // }
    console.log('url', url);
    this.http.get(url).subscribe((response: any) => {
      console.log(response.egg_groups, 'trial');
      console.log(response.evolution_chain, 'Main - evoultion - chain');
      //this.pokemonEvolutionChain = response.evolution_chain;

      if (
        response &&
        response.flavor_text_entries &&
        response.flavor_text_entries.length > 0
      ) {
        const pokemonDetails: string[] = response.flavor_text_entries
          .filter((entry: any) => entry.language.name === 'en')
          .map((entry: any) => entry.flavor_text);
        this.pokemonDetails = pokemonDetails.toString();
        console.log(this.pokemonDetails);
      }

      if (response && response.egg_groups) {
        this.pokemonEggGroup = response.egg_groups.map(
          (entry: any) => entry.name
        );
        console.log(this.pokemonEggGroup);
      }

      if (response && response.evolution_chain) {
        const evolutionChainUrl = response.evolution_chain.url;
        this.fetchEvolutionChain(evolutionChainUrl);
      }
    });
  }

  fetchEvolutionChain(url: string) {
    this.http.get(url).subscribe((response: any) => {
      //console.log(response.chain.species.name, 'chain-response');(It gives that particular array).
      console.log(response, 'fetchnew');
      this.allNames = [];

      const processChain = (chain: any) => {
        this.allNames.push(chain.species.name);
        if (chain.evolves_to && chain.evolves_to.length > 0) {
          chain.evolves_to.forEach((evolution: any) => {
            processChain(evolution);
          });
        }
      };

      processChain(response.chain);
      for (let i = 0; i < this.allNames.length; i++) {
        const currentName = this.allNames[i];
        console.log(currentName, '123');
        //console.log(this.allNames, '123');
      }
    });
  }

  getBaseStat(statName: string) {
    if (
      this.selectedPokemon &&
      this.selectedPokemon.stats &&
      this.selectedPokemon.stats.length > 0
    ) {
      const value = this.selectedPokemon.stats.find((entry: any) => {
        // console.log(entry, 'entry1', entry.stat.name === statName);
        return entry && entry.stat && entry.stat.name === statName;
      });
      //console.log(value, '123');
      // console.log(this.selectedPokemon.stats, 'sele.stats');

      return value ? value.base_stat : 0;
    }
    // return 0;
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

    const primaryType = this.selectedPokemon.types[0]?.type?.name;
    const secondaryType =
      this.selectedPokemon.types.length > 1
        ? this.selectedPokemon.types[1]?.type?.name
        : null;
    const primaryColor = typeColors[primaryType] || '#FFFFFF';
    const secondaryColor = secondaryType
      ? typeColors[secondaryType]
      : typeColors[primaryType];
    this.backgroundColor = `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`;
  }
}

//[0].height (game_indices ->height)
//[0].weight (types -> weight)
//Female = https://pokeapi.co/api/v2/gender/1
//Male = https://pokeapi.co/api/v2/gender/2
//Both = https://pokeapi.co/api/v2/gender/3
