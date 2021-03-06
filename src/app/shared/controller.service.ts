import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


import { Card } from './../models/card';
import { User } from '../models/user';

@Injectable()
export class ControllerService {

  private user_logado: User;

  constructor(
    private router: Router
  ) {
    this.user_logado = null;
  }

  /**
   * Add a new card
   * @param email Email
   * @param discipline Discipline
   * @param question Question
   * @param answer Answer
   */
  public addNewCard(email: string, discipline: string, question: string, answer: string, privacy: boolean): Promise<any> {
    let user: User;
    return this.getUser(email).then(data => {
      user = new User(data.username, data.email, data.image);
    }).then(a => {
      if (user != null || user !== undefined) {
        this.user_logado.addNewCard(discipline, question, answer, privacy);
      }
    });
  }

  /**
   * Add new user and log-in
   * @param username Username
   * @param email Email
   * @param image Url image
   */
  public log(username: string, email: string, image: string): void {
    this.addUser(username, email, image)
      .then(s => {
        this.logIn(email);
      });
  }

  /**
   * Add new user
   * @param username Username
   * @param email Email
   * @param image Url Image
   */
  public addUser(username, email, image) {
    return fetch('https://api-flashcard.herokuapp.com/api/user', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        username: username,
        email: email,
        image: image
      })
    });
  }

  /**
   * Get user by Email
   * @param email Email
   */
  public getUser(email: string) {
    return fetch('https://api-flashcard.herokuapp.com/api/user/' + email).then(res => res.json());
  }

  /**
   * Get all users
   */
  public getUsers() {
    return fetch('https://api-flashcard.herokuapp.com/api/user/').then(res => res.json());
  }

  /**
   * Get all public cards
   */
  public getAllPublicCards(): Card[] {
    const cards: Card[] = [];
    let request = [];
    this.getPublicCards()
      .then(data => {
        request = data;
      }).then(a => {
        request.forEach(e => {
          const card = new Card(e.id, e.discipline, e.question, e.answer, e.privacy, e.author, e.image);
          cards.push(card);
        });
        return cards.sort((c, b) => b.getId() - c.getId());
      });
    return cards;
  }

  public getPublicCards(): Promise<any> {
    return fetch('https://api-flashcard.herokuapp.com/api/card/').then(res => res.json());
  }

  public getUserCards(email: String): Promise<any> {
    return fetch('https://api-flashcard.herokuapp.com/api/card/user/' + email).then(res => res.json());
  }

  public getCardById(id: String): Promise<any> {
    return fetch('https://api-flashcard.herokuapp.com/api/card/' + id).then(res => res.json());
  }

  public getComments(id: String): Promise<any> {
    return fetch('https://api-flashcard.herokuapp.com/api/msg/card/' + id).then(res => res.json());
  }

  /**
   * Get user logado
   */
  public getUserLogado() {
    return this.user_logado;
  }

  /**
   * Login
   * @param email Email
   */
  public logIn(email: string) {
    let user: User;
    return this.getUser(email).then(data => {
      user = new User(data.username, data.email, data.image);
    }).then(a => {
      this.user_logado = user;
      localStorage.setItem('isLogged', 'true');
      localStorage.setItem('username', this.user_logado.getUsername());
      localStorage.setItem('email', this.user_logado.getEmail());
      localStorage.setItem('image', this.user_logado.getImage());
      this.navigate('/perfil');
    });
  }

  public reloadPage() {
    const isLogged = localStorage.getItem('isLogged');
    if (isLogged != null && isLogged === 'true') {
      const username = localStorage.getItem('username');
      const email = localStorage.getItem('email');
      const image = localStorage.getItem('image');
      if (username != null && email != null && image != null) {
        this.user_logado = new User(username, email, image);
      }
    }
  }

  /**
   * Log out
   */
  public logOut(): void {
    this.user_logado = null;
    localStorage.clear();
    localStorage.setItem('isLogged', 'false');
  }

  public navigate(address: string): void {
    this.router.navigate([address]);
  }

  public getRouter(): Router {
    return this.router;
  }

  public turnOnServer(): Promise<any> {
    return fetch('https://api-flashcard.herokuapp.com/api/user');
  }

  /**
  * Delete card
  * @param id Card id
  */
  public deleteCard(id: number): Promise<any> {
    return fetch('https://api-flashcard.herokuapp.com/api/card/' + id, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    });
  }
}
