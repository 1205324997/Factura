import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/voucherapi.service';
import { HttpParams } from '@angular/common/http';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-liquidation',
  templateUrl: './liquidation.component.html',
  styleUrls: ['./liquidation.component.scss']
})
export class LiquidationComponent {
  vouchers: any[] = [];
  filteredVouchers: any[] = [];
  vouchersVisible: boolean = false;
  filtroTipoFactura: string = 'Facturas'; 

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    console.log("Invoice component initialized.");
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
        console.log("Invoice obtained:", this.vouchers);
      },
      (error) => {
        console.error('Error obtaining invoice:', error);
      }
    );
  }

  filtrarVouchers(tipoFactura: string): void {
    console.log("Type of invoice select:", tipoFactura);
    this.filtroTipoFactura = tipoFactura;
    this.filtrarVouchersPorTipoFactura();
  }
  //Download PDF
  
  descargarPDF(voucher: any): void {
    const doc = new jsPDF();
    const voucherTexto = `
      Tipo de Factura: ${voucher.voucherType}
      Nombre: ${voucher.businessName}
      RUC: ${voucher.ruc}
      Estado: ${voucher.status}
      Estado SRI: ${voucher.statusSri}
      Fecha de factura: ${voucher.broadcastDate}
      Subtotal: ${voucher.subtotal}
      IVA: ${voucher.subtotalNotSubjectIVA}
      Total: ${voucher.total}
    `;
    doc.text(voucherTexto, 10, 10);
    doc.save(`voucher_${voucher.id}.pdf`);
  }

  //Filter type voucher 
  filtrarVouchersPorTipoFactura(): void {  
    const tipoFacturaBuscado = 'LIQUIDACION_COMPRA';
  
    if (tipoFacturaBuscado) {
      this.filteredVouchers = this.vouchers.filter(voucher => voucher.voucherType === tipoFacturaBuscado);
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



