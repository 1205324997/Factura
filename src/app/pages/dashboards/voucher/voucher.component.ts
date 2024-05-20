import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/core/services/voucherapi.service';
import { HttpParams } from '@angular/common/http';
import jsPDF from 'jspdf';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmailService } from 'src/app/core/services/email.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {
  vouchers: any[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['sequential', 'business_name', 'ruc', 'status', 'status_sri', 'broadcast_date', 'acciones', 'sendEmail'];
  filteredVouchers: any[] = []; 
  mostrarFormularioEmail = false;

  columnasTraducidas = {
    'sequential': 'Código',
    'business_name': 'Nombre',
    'ruc': 'RUC',
    'status': 'Estado',
    'status_sri': 'Estado SRI',
    'broadcast_date': 'Fecha de Emisión',
    'acciones': 'Acciones',
    'sendEmail': 'Enviar correo'
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
Hasta: any;

  constructor(private apiService: ApiService, private emailService: EmailService ) {}

  ngOnInit(): void {
    this.emailService.mostrarFormularioEmail$.subscribe(
      (mostrar: boolean) => {
        this.mostrarFormularioEmail = mostrar;
      }
    );
    console.log("Componente Voucher inicializado.");
    this.obtenerVouchers();
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const dataStr = Object.keys(data).reduce((concatenated, key) => {
          return concatenated + (data[key] ? data[key].toString().toLowerCase() : '');
        }, '');

        const sequentialWithoutZeros = data.sequential.replace(/^0+/, '');

        return dataStr.includes(filter) || (sequentialWithoutZeros.includes(filter))  || (data.business_name && data.business_name.includes(filter)) || (data.status_sri && data.status_sri.includes(filter));
      };
    }
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
        this.ngAfterViewInit();
      },
      (error) => {
        console.error('Error al obtener vouchers:', error);
      }
    );
  }

  aplicarFiltro(event: Event): void {
    const filtro = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filtro;
  }

  filtrarPorFechas(): void {
    const fechaDesde = (document.getElementById('fechaDesde') as HTMLInputElement).value;
    const fechaHasta = (document.getElementById('fechaHasta') as HTMLInputElement).value;
  
    if (fechaDesde && fechaHasta) {
      this.filteredVouchers = this.vouchers.filter(voucher => {
        const fechaVoucher = new Date(voucher.broadcast_date);
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
    this.apiService.getPdfVoucher(voucher.id, 1).subscribe(
      (pdfBlob: Blob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `voucher_${voucher.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      (error) => {
        console.error('Error al descargar el PDF del voucher:', error);
      }
    );
  }

  descargarXML(voucher: any): void {
    let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<voucher>\n';

    // Generamos el XML del voucher basado en los datos del voucher
    for (const key in voucher) {
      if (voucher.hasOwnProperty(key) && this.displayedColumns.includes(key)) {
        xmlString += `\t<${key}>${voucher[key]}</${key}>\n`;
      }
    }

    xmlString += '</voucher>';

    // Descargar el XML generado
    const blob = new Blob([xmlString], { type: 'text/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voucher_${voucher.id}.xml`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  enviarCorreo(voucher: any): void {
    this.mostrarFormularioEmail = true;
  }

  // Función para capitalizar las palabras
  capitalize(value: string): string {
    if (typeof value !== 'string') return value;
    return value.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }
}
