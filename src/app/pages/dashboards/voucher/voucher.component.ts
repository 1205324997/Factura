import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/core/services/voucherapi.service';
import { HttpParams } from '@angular/common/http';
import jsPDF from 'jspdf';
import * as xml2js from 'xml2js';
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
  displayedColumns: string[] = ['voucherTypeCode','voucherType', 'businessName', 'ruc', 'status', 'statusSri', 'broadcastDate', 'acciones', 'sendEmail'];
  filteredVouchers: any[] = []; 

  columnasTraducidas = {
    'voucherTypeCode': 'Código',
    'voucherType': 'Comprobante',
    'businessName': 'Nombre',
    'ruc': 'RUC',
    'status': 'Estado',
    'statusSri': 'Estado SRI',
    'broadcastDate': 'Fecha de Emisión',
    'acciones': 'Acciones',
    'sendEmail': 'Enviar correo'
  };


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiService, private emailService: EmailService ) {}

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

    doc.text(voucherTexto, 10, 10);
    doc.save(`voucher_${voucher.id}.pdf`);
  }

  descargarXML(voucher: any): void {
    let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<voucher>\n';

    // Generar el XML del voucher basado en los datos del voucher
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
    const destinatario = 'destinatario@example.com';
    const asunto = `Voucher ${voucher.id}`;
    const cuerpo = `Adjunto encontrarás el voucher ${voucher.id}`;
    const adjuntos = [`voucher_${voucher.id}.pdf`, `voucher_${voucher.id}.xml`];
    const datosCorreo = {
      emails: [destinatario],
      subject: asunto,
      body: cuerpo,
      attachments: adjuntos
    };
    this.emailService.enviarCorreo(datosCorreo)
      .then(response => {
        console.log('Correo enviado correctamente:', response);
      })
      .catch(error => {
        console.error('Error al enviar el correo:', error);
      });
  }
  


  // Función para capitalizar las palabras
  capitalize(value: string): string {
    if (!value) return value;
    return value.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }
}
