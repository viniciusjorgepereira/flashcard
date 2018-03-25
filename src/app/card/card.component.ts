import { Card } from './../models/card';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  private cards: Card[] = [];
  private colors: string[] = [
      'red', 'orange', 'yellow', 'olive', 'green',
      'teal', 'blue', 'violet', 'purple', 'pink',
      'brown', 'grey', 'black'
  ];

  constructor() { }

  ngOnInit() {
  }

  /**
   * Add a new card
   * @param discipline Discipline
   * @param question Question
   * @param answer Answer
   */
  public addCard(discipline: string, question: string, answer: string): void {
    const id = this.cards.length + 1;
    const card = new Card(discipline, question, answer, id);
    this.cards.push(card);
  }

  /**
   * Get card by id
   * @param id Id
   */
  public getCard(id: number): Card {
    return this.cards[id];
  }

  /**
   * Get card rating
   * @param id Id
   */
  public getCardRating(id: number): number {
    const card = this.getCard(id);
    return card.getRating();
  }

  /**
   * Get color name
   */
  public getColor(): string {
    const index = Math.floor(Math.random() * (this.colors.length - 1));
    return this.colors[index];
  }

}
