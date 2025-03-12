import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Contato } from '../../models/contato';
import { ContatoService } from '../../services/contatos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-contatoslist',
  imports: [FormsModule, CommonModule],
  templateUrl: './contatoslist.component.html',
  styleUrl: './contatoslist.component.scss'
})
export class ContatoslistComponent {
  lista: Contato[] = [];
  contatoEdit: Contato = new Contato();

  @Input('contato') contato: Contato = new Contato();
  @Output('retorno') retorno = new EventEmitter<any>();

router = inject(ActivatedRoute);

  contatoService = inject(ContatoService);

  constructor() {
    this.listAll();

    let id = this.router.snapshot.params['id'];
    if (id > 0) {
      this.findById(id);
    }

    let contatoNovo = history.state.contatoNovo;
    let contatoEditado = history.state.contatoEditado;

    if (contatoNovo != null) {
      this.lista.push(contatoNovo);
    }

    if (contatoEditado != null) {
      let indice = this.lista.findIndex((x) => {
        return x.id == contatoEditado.id;
      });
      this.lista[indice] = contatoEditado;
    }
  }

  listAll() {
    console.log('a');

    this.contatoService.listAll().subscribe({
      next: (lista) => {
        console.log('b');
        this.lista = lista;
      },
      error: (erro) => {
        alert('Não foi possivel exibir a lista');
      },
    });
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
      if (this.contatoEdit.id > 0) {
        // Editando o contato
        this.contatoService.update(this.contatoEdit).subscribe({
          next: () => {
            Swal.fire({
              title: 'Editado com sucesso!',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            this.listAll();
            this.new(); // Limpar o formulário
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
        // Criando um novo contato
        this.contatoService.save(this.contatoEdit).subscribe({
          next: () => {
            Swal.fire({
              title: 'Sucesso!',
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            this.listAll();
            this.new(); // Limpar o formulário
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

  deleteById(contato: Contato) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Deseja realmente deletar o cadastro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.contatoService.delete(contato.id).subscribe({
            next: (retorno) => {
              swalWithBootstrapButtons.fire({
                title: 'Cadastro deletado',
                text: 'O cadastro do contato foi deletado com sucesso!',
                icon: 'success',
              });
              this.listAll();
            },
            error: (erro) => {
              alert(erro.status);
              console.log(erro);
              swalWithBootstrapButtons.fire({
                title: 'Cadastro não deletado. Erro: ',
                icon: 'error',
              });
            },
          });
        }
      });
  }

  new() {
    this. contatoEdit = new Contato();
  }

  edit(contato: Contato) {
    this.contatoEdit = { ...contato };
  }

  retornoDetalhe(contato: Contato) {
    this.listAll();
    
  }
}