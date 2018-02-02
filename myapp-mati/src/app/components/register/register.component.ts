import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';

import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	name: String;
	lastname: String;
	email: String;
	rol: String;
	password: String;

  constructor(private validateService: ValidateService, 
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
  	console.log(123);
  	const user = {
  		nombre: this.name,
  		apellido: this.lastname,
  		correo: this.email,
  		contraseña: this.password,
  		rol: this.rol
  	}

    //Required fields
    if(!this.validateService.validateRegister(user)){
      this.flashMessage.show('Please rellena todos los campos', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    //Validar email
    if(!this.validateService.validateEmail(user.correo)){
      this.flashMessage.show('Please usa un correo valido', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    //Registrar usuario
    this.authService.registerUser(user).subscribe(data => {
      if(data.success){
        this.flashMessage.show('Ahora estas registrado y puedes entrar', {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/login']);
      } else {
        this.flashMessage.show('Algo salio mal', {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/register']);
      }
    })

  }

}
