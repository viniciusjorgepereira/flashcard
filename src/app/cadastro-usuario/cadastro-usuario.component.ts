import { Component, OnInit } from '@angular/core';


import { ControllerService } from './../shared/controller.service';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent implements OnInit {

  constructor(
    private controller: ControllerService
  ) { }

  ngOnInit() {
  }

  /**
   * Add a new user
   * @param username Username
   * @param pswd Password
   * @param pswd2 Password 2
   */
  public addNewUser(username: string, pswd: string, pswd2: string): void {
    if (this.validaEntrada(username) && this.validaEntrada(pswd) && this.verificaSenha(pswd, pswd2)) {
      const user = this.controller.getUser(username);
      if (user == null) {
        this.controller.addNewUser(username, pswd);
        this.controller.logIn(username);
        this.controller.navigate('/perfil');
        alert('Usuário criado com sucesso');
      } else {
        alert('Nome de usuário já cadastrado');
      }
    } else {
      alert('Dados inválidos');
    }
  }

  public validaEntrada(value: string): boolean {
    return value.trim().length !== 0;
  }

  public verificaSenha(pswd: string, pswd2: string): boolean {
    return pswd.trim() === pswd2.trim();
  }

}