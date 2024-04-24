import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/voucherapi.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent implements OnInit {
  vouchers: any[] = [];
  vouchersVisible: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    console.log("Componente Voucher inicializado.");

    const params = new HttpParams()
      .set('pageSize', '100')
      .set('startIndex', '0');
      
    this.apiService.getVouchers(params).subscribe(
      (response: any[]) => {
        this.vouchers = response;
        console.log("Respuesta del servicio recibida:", this.vouchers);
      },
      (error) => {
        console.error('Error al obtener vouchers:', error);
      }
    );
  }

  mostrarVouchers(): void {
    console.log("Botón 'Mostrar Vouchers' clicado.");
    this.vouchersVisible = true;
  }
}
