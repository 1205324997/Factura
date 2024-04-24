import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/voucherapi.service';
import { HttpParams } from '@angular/common/http';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
 
})
export class VoucherComponent implements OnInit {
  vouchers: any[] = [];
  filteredVouchers: any[] = [];
  vouchersVisible: boolean = false;
  filtroTipoFactura: string = 'Facturas'; 
  estadosDisponibles: string[] = [''];
  

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    console.log("Componente Voucher inicializado.");
    this.obtenerVouchers();
  }

  capitalizePipe = {
    transform(value: string): string {
      if (!value) return value;
      return value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }
  };

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
    const tipoFacturaMap = {
      'Facturas': 'FACTURA',
      'Notas de crédito': 'NOTA_CREDITO',
      'Notas de débito': 'NOTA_DEBITO',
      'Liquidaciones de compras de bienes y prestación de servicios': 'LIQUIDACION_COMPRA',
      'Comprobantes de retención': 'COMPROBANTE_RETENCION',
      'Guías de remisión': 'GUIA_REMISION'
    };
  
    const tipoFactura = tipoFacturaMap[this.filtroTipoFactura];
  
    if (tipoFactura) {
      this.filteredVouchers = this.vouchers.filter(voucher => voucher.voucherType === tipoFactura);
    } else {
      this.filteredVouchers = [];
    }
  
    this.vouchersVisible = this.filteredVouchers.length > 0;
  }
    

  filtrarPorEstado(estado: string): void {
    if (estado.trim() === '') {
      this.filteredVouchers = this.vouchers;
    } else {
      this.filteredVouchers = this.vouchers.filter(voucher => voucher.status === estado);
    }
  }
  
  filtrarPorFechas(): void {
    const fechaDesde = (document.getElementById('fechaDesde') as HTMLInputElement).value;
    const fechaHasta = (document.getElementById('fechaHasta') as HTMLInputElement).value;
  
    if (fechaDesde && fechaHasta) {
      this.filteredVouchers = this.vouchers.filter(voucher => {
        const fechaVoucher = new Date(voucher.broadcastDate);
        const fechaDesdeObj = new Date(fechaDesde);
        const fechaHastaObj = new Date(fechaHasta);
  
        return fechaVoucher >= fechaDesdeObj && fechaVoucher <= fechaHastaObj;
      });
    } else {
      
      this.filteredVouchers = this.vouchers;
    }
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
