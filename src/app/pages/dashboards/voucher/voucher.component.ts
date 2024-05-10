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
  displayedColumns: string[] = ['voucherTypeCode','voucherType', 'businessName', 'ruc', 'status', 'statusSri', 'broadcastDate', 'acciones'];
  filteredVouchers: any[] = []; 

  columnasTraducidas = {
    'voucherTypeCode': 'Código',
    'voucherType': 'Comprobante',
    'businessName': 'Nombre',
    'ruc': 'RUC',
    'status': 'Estado',
    'statusSri': 'Estado SRI',
    'broadcastDate': 'Fecha de Emisión',
    'acciones': 'Acciones'
  };


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
        this.filteredVouchers = response; 
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
    const filtro = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filtro;
    this.dataSource.filterPredicate = (data: any) => {
      const dataStr = Object.keys(data).reduce((concatenated, key) => {
        if (key === 'voucherTypeCode') {
          return concatenated + data[key];
        }
        return concatenated + (data[key] ? data[key].toString().toLowerCase() : '');
      }, '');
      return dataStr.includes(filtro);
    };
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
    let voucherTexto = '';

    // Generar el texto del voucher basado en los datos del voucher
    for (const key in voucher) {
      if (voucher.hasOwnProperty(key) && this.displayedColumns.includes(key)) {
        voucherTexto += `${this.columnasTraducidas[key]}: ${voucher[key]}\n`;
      }
    }

    // Descargar el PDF con el texto generado
    doc.text(voucherTexto, 10, 10);
    doc.save(`voucher_${voucher.id}.pdf`);
  }


  // Función para capitalizar las palabras
  capitalize(value: string): string {
    if (!value) return value;
    return value.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }
}
