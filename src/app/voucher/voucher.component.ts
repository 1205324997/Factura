import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/voucherapi.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {
  vouchers: any[] = [];
  filteredVouchers: any[] = [];
  vouchersVisible: boolean = false;
  filtroTipoFactura: string = 'Facturas'; 

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    console.log("Componente Voucher inicializado.");
    this.obtenerVouchers();
  }

  obtenerVouchers(): void {
    const params = new HttpParams()
      .set('pageSize', '100')
      .set('startIndex', '0')
      .set('tipoFactura', this.filtroTipoFactura); 

    this.apiService.getVouchers(params).subscribe(
      (response: any[]) => {
        this.vouchers = response;
        this.filtrarVouchersPorTipoFactura(); 
        console.log("Respuesta del servicio recibida:", this.vouchers);
      },
      (error) => {
        console.error('Error al obtener vouchers:', error);
      }
    );
  }

  filtrarVouchers(tipoFactura: string): void {
    console.log("Tipo de factura seleccionado:", tipoFactura);
    this.filtroTipoFactura = tipoFactura;
    this.filtrarVouchersPorTipoFactura();
  }
  
  filtrarVouchersPorTipoFactura(): void {
    if (this.filtroTipoFactura === 'Facturas') {
      this.filteredVouchers = this.vouchers.filter(voucher => voucher.voucherType === 'FACTURA');
    } else if (this.filtroTipoFactura === 'Notas de crédito') {
      this.filteredVouchers = this.vouchers.filter(voucher => voucher.voucherType === 'NOTA_CREDITO');
    } else if (this.filtroTipoFactura === 'Notas de débito') {
      this.filteredVouchers = this.vouchers.filter(voucher => voucher.voucherType === 'NOTA_DEBITO');
    } else {
      this.filteredVouchers = [];
    }
    
    this.vouchersVisible = this.filteredVouchers.length > 0;
  }  

  filtrarPorRuc(ruc: string): void {
    if (ruc.trim() === '') {
      this.filteredVouchers = this.vouchers;
    } else {
      this.filteredVouchers = this.vouchers.filter(voucher => voucher.ruc.includes(ruc.trim()));
    }
  }
    
  mostrarTodasLasFacturas(): void {
    this.filteredVouchers = this.vouchers; 
    this.vouchersVisible = true; 
  }
}
