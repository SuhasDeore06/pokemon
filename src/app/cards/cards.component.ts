import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent implements OnInit {
  @Input() hero: any;
  @Input() backgroundColor: string = '';

  @Input() pokemonDetails: any[] = [];
  @Output() openPopup: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onCardClick(pokemon: any) {
    this.openPopup.emit(pokemon);
  }
}
