import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/voucherapi.service';
import { HttpParams } from '@angular/common/http';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-debitnotes',
  templateUrl: './debitnotes.component.html',
  styleUrls: ['./debitnotes.component.scss']
})
export class DebitnotesComponent implements OnInit {
  vouchers: any[] = [];
      allVouchers: any[] = [];
      filteredVouchers: any[] = [];
      vouchersVisible: boolean = false;
      filtroEstados: string = '';
      estadoNoEncontradoMensaje: string = '';
      filtroTipoFactura: string = 'Factura';
      estadosDisponibles: string[] = [''];
      facturasNoEncontradasMensaje: string = '';
    
      constructor(private apiService: ApiService) {}
      
      ngOnInit(): void {
        console.log("Invoice component initialized.");
        this.obtenerVouchers();
      
        // Verify invoices upon initialization
        if (this.filteredVouchers.length === 0 && this.filtroEstados.trim() === '') {
          this.facturasNoEncontradasMensaje = "No existen facturas para mostrar.";
        }
      }
      obtenerVouchers(): void {
        const params = new HttpParams()
          .set('pageSize', '100')
          .set('startIndex', '0')
          .set('tipoFactura', this.filtroTipoFactura);
    
        this.apiService.getVouchers(params).subscribe(
          (response: any[]) => {
            this.vouchers = response;
            this.allVouchers = response; 
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
        this.filtrarPorEstado(this.filtroEstados);
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
    
      filtrarVouchersPorTipoFactura(): void {
        const tipoFacturaBuscado = 'NOTA_DEBITO';
      
        if (tipoFacturaBuscado) {
          this.filteredVouchers = this.allVouchers.filter(voucher => voucher.voucherType === tipoFacturaBuscado);
        } else {
          this.filteredVouchers = [];
        }
      
        this.vouchersVisible = this.filteredVouchers.length > 0;
      }
      
      filtrarPorEstado(estado: string): void {
        this.filtroEstados = estado;
      
        if (estado.trim() === '') {
          this.facturasNoEncontradasMensaje = `No se encontraron facturas del tipo "${this.filtroTipoFactura}".`;
          this.filteredVouchers = [];
        } else {
          this.filteredVouchers = this.allVouchers.filter(voucher => voucher.voucherType === 'NOTA_DEBITO' && voucher.status === estado.trim());
          this.facturasNoEncontradasMensaje = '';
        }
      
        if (this.filteredVouchers.length > 0) {
          this.estadoNoEncontradoMensaje = '';
        } else {
          this.estadoNoEncontradoMensaje = `No existen notas de crédito con el estado "${estado}".`;
        }
      
        this.actualizarListaFiltrada();
      }
      
    
      actualizarListaFiltrada(): void {
        if (this.filtroEstados.trim() === '') {
          this.vouchersVisible = false;
          this.filteredVouchers = [];
        } else {
          this.vouchersVisible = this.filteredVouchers.length > 0;
        }
      }
    }
    