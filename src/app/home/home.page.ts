import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

type Venda = {
  valor: number;
  data: string;
};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonProgressBar,
    IonItem,
    IonInput,
    IonButton,
    IonList,
    IonListHeader,
    IonLabel,
  ],
})
export class HomePage {
  vendas: Venda[] = [];
  total = 0;
  comissao = 0;
  falta = 0;
  novaVenda = '';

  adicionarVenda() {
    if (!this.novaVenda) return;

    const valorConvertido = Number(this.novaVenda.replace(/\./g, '').replace(',', '.'));

    if (isNaN(valorConvertido)) {
      alert('Valor inválido');
      return;
    }

    const venda: Venda = {
      valor: valorConvertido,
      data: new Date().toLocaleString(),
    };

    this.vendas.push(venda);
    this.novaVenda = '';

    this.salvarDados();
    this.atualizar();
  }

  atualizar() {
    this.total = this.vendas.reduce((acc, v) => acc + v.valor, 0);
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
    if (total < 26001) return 26001 - total;
    if (total < 30001) return 30001 - total;
    if (total < 40001) return 40001 - total;
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

  removerVenda(index: number) {
    const confirmar = confirm('Deseja excluir essa venda ?');

    if (!confirmar) return;

    this.vendas.splice(index, 1);
    this.salvarDados();
    this.atualizar();
  }

  resetarMes() {
    const confirmar = confirm('Deseja resetar o mês ?');

    if (!confirmar) return;

    this.vendas = [];
    this.salvarDados();
    this.atualizar();
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  get progresso(): number {
    if (this.total >= 40000) return 1;
    return this.total / 40000;
  }

  get corProgresso(): string {
    if (this.total >= 40000) return 'success';
    if (this.total >= 30001) return 'success';
    if (this.total >= 26001) return 'success';
    return 'danger';
  }

  formatarInput(event: CustomEvent) {
    let valor = String(event.detail?.value ?? '');

    valor = valor.replace(/\D/g, '');

    if (!valor) {
      this.novaVenda = '';
      return;
    }

    valor = (Number(valor) / 100).toFixed(2);
    valor = valor.replace('.', ',');
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    this.novaVenda = valor;
  }

  ngOnInit() {
    this.carregarDados();
  }
}
