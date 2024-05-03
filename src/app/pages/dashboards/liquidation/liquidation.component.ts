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
  filtroTipoFactura: string = 'Liquidación de compra';
  filtroEstados: string = '';
  estadoNoEncontradoMensaje: string = '';
  facturasNoEncontradasMensaje: string = ''; 
  estadosDisponibles: string[] = ['']; 
  
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    console.log("Invoice component initialized.");
    this.obtenerVouchers();
    this.facturasNoEncontradasMensaje = `No se encontraron facturas del tipo "${this.filtroTipoFactura}".`;
  }

  obtenerVouchers(): void {
    const params = new HttpParams()
      .set('pageSize', '100')
      .set('startIndex', '0')
      .set('tipoFactura', this.filtroTipoFactura);

    this.apiService.getVouchers(params).subscribe(
      (response: any[]) => {
        this.vouchers = response;
        console.log("Datos de vouchers recuperados:", this.vouchers);
        this.filtrarVouchersPorTipoFactura();
      },
      (error) => {
        console.error('Error obtaining invoice:', error);
      }
    );
  }
 //filter for type invoices
  filtrarVouchersPorTipoFactura(): any[] {
    const tipoFacturaBuscado = 'LIQUIDACION_COMPRA';
    return this.vouchers.filter(voucher => voucher.voucherType === tipoFacturaBuscado);
  }
  
  //filter for status
  filtrarPorEstado(estado: string): void {
    this.filtroEstados = estado;
  
    if (estado.trim() === '') {
      this.facturasNoEncontradasMensaje = `No se encontraron facturas del tipo "${this.filtroTipoFactura}".`;
      this.filteredVouchers = this.filtrarVouchersPorTipoFactura();
    } else {
      this.filteredVouchers = this.filtrarVouchersPorTipoFactura().filter(voucher => voucher.status === estado.trim());
      this.facturasNoEncontradasMensaje = '';  
    }
  
    if (this.filteredVouchers.length > 0) {
      this.estadoNoEncontradoMensaje = ''; 
    } else {
      this.estadoNoEncontradoMensaje = `No existen notas de crédito con el estado "${estado}".`;
    }
  
    this.actualizarListaFiltrada(); 
  }
  //Updating changes
  actualizarListaFiltrada(): void {
    if (this.filtroEstados.trim() === '') {
      this.vouchersVisible = false;
      this.filteredVouchers = []; 
    } else {
      this.vouchersVisible = this.filteredVouchers.length > 0;
    }
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
}
