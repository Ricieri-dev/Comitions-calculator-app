import { Component } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, FormsModule],
})
export class HomePage {

  vendas: number[] = [];
  total: number = 0;
  comissao: number = 0;
  falta: number = 0;
  novaVenda: number = 0;

  adicionarVenda() {
    if (!this.novaVenda) return;

    this.vendas.push(this.novaVenda);
    this.novaVenda = 0;

    this.salvarDados();
    this.atualizar();
  }

  atualizar() {
    this.total = this.vendas.reduce((a, b) => a + b, 0);
    this.comissao = this.calcularComissao(this.total);
    this.falta = this.proximaMeta(this.total);
  }

  calcularComissao(total: number): number {
    if (total >= 40001) return total * 0.01;
    if (total >= 30001) return total * 0.0075;
    if (total >= 26001) return total * 0.005;
    return 0;
  }

  proximaMeta(total: number): number {
    if (total < 26000) return 26000 - total;
    if (total < 30000) return 30000 - total;
    if (total < 40000) return 40000 - total;
    return 0;
  }

  salvarDados() {
  localStorage.setItem('vendas', JSON.stringify(this.vendas));
  }

  carregarDados() {
  const dados = localStorage.getItem('vendas');

  if (dados) {
    this.vendas = JSON.parse(dados);
    this.atualizar();
    }
  }

  ngOnInit() {
  this.carregarDados();
  }
}
