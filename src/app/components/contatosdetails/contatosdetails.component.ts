import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { Contato } from '../../models/contato';
import { ContatoService } from '../../services/contatos.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-contatosdetails',
  imports: [FormsModule],
  templateUrl: './contatosdetails.component.html',
  styleUrl: './contatosdetails.component.scss'
})
export class ContatosdetailsComponent {

  @Input('contato') contato: Contato = new Contato();
  @Output('retorno') retorno = new EventEmitter<any>();

  router = inject(ActivatedRoute);
  router2 = inject(Router);

  contatoService = inject(ContatoService);

  constructor() {
    let id = this.router.snapshot.params['id'];
    if (id > 0) {
      this.findById(id);
    }
  }

  findById(id: number) {
    this.contatoService.findById(id).subscribe({
      next: (contato) => {
        this.contato = contato;
      },
      error: () => {
        Swal.fire({
          title: 'Algo deu errado na busca, tente novamente.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }

  save() {
    if (this.contato.id > 0) {
      this.contatoService.update(this.contato).subscribe({
        next: (retorno) => {
          Swal.fire({
            title: 'Editado com sucesso!',
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.router2.navigate(['contatos'], {
            state: { contatoNovo: this.contato },
          });
          this.retorno.emit(this.contato);
        },
        error: () => {
          Swal.fire({
            title: 'Erro ao editar o cadastro do contato',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        },
      });
    } else {
      this.contatoService.save(this.contato).subscribe({
        next: (retorno) => {
          Swal.fire({
            title: 'Sucesso!',
            confirmButtonColor: '#54B4D3',
            text: 'Contato salvo com sucesso!',
            icon: 'success',
          });
          this.router2.navigate(['contatos'], {
            state: { contatoNovo: this.contato },
          });
          this.retorno.emit(this.contato);
        },
        error: () => {
          Swal.fire({
            title: 'Erro ao salvar o contato',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        },
      });
    }
  }

}