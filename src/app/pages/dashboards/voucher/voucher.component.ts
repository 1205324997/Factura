import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/core/services/voucherapi.service';
import { HttpParams } from '@angular/common/http';
import jsPDF from 'jspdf';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
})
export class VoucherComponent implements OnInit {
  vouchers: any[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['voucherType', 'businessName', 'ruc', 'status', 'statusSri', 'broadcastDate', 'subtotal', 'subtotalNotSubjectIVA', 'total', 'acciones'];
  filteredVouchers: any[] = []; // Define filteredVouchers como un array vacío

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    console.log("Componente Voucher inicializado.");
    this.obtenerVouchers();
  }

  obtenerVouchers(): void {
    const params = new HttpParams()
      .set('pageSize', '100')
      .set('startIndex', '0')
      .set('tipoFactura', 'Facturas');

    this.apiService.getVouchers(params).subscribe(
      (response: any[]) => {
        this.vouchers = response;
        this.filteredVouchers = response; // Inicializa filteredVouchers con los vouchers obtenidos
        this.dataSource = new MatTableDataSource<any>(this.vouchers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log("Respuesta del servicio recibida:", this.vouchers);
      },
      (error) => {
        console.error('Error al obtener vouchers:', error);
      }
    );
  }

  aplicarFiltro(event: Event): void {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
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

    this.dataSource = new MatTableDataSource<any>(this.filteredVouchers);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
