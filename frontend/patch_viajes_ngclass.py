import re

file_path = r"c:\Users\JereM\OneDrive\Desktop\Paoloni\frontend\src\app\features\viajes\viajes.component.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Combustible Panel Left
content = content.replace(
    """<!-- Lista Izquierda -->
              <div class="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto shadow-sm flex-col" [ngClass]="{'hidden md:flex': isCreatingViaje || isViewingViaje || selectedViajeId, 'flex': !(isCreatingViaje || isViewingViaje || selectedViajeId)}">
                <div *ngFor="let c of cargas" (click)="verDetalleCombustible(c); isViewingCombustible=true" """,
    """<!-- Lista Izquierda -->
              <div class="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto shadow-sm flex-col" [ngClass]="{'hidden md:flex': isCreatingCombustible || isViewingCombustible || selectedCombustibleId, 'flex': !(isCreatingCombustible || isViewingCombustible || selectedCombustibleId)}">
                <div *ngFor="let c of cargas" (click)="verDetalleCombustible(c); isViewingCombustible=true" """
)

# Combustible Panel Right
content = content.replace(
    """<!-- Panel Derecho -->
              <div class="w-full md:w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto flex-col" [ngClass]="{'hidden md:flex': !(isCreatingViaje || isViewingViaje || selectedViajeId), 'flex': isCreatingViaje || isViewingViaje || selectedViajeId}">
                <!-- Modo Placeholder -->
                <div *ngIf="!isViewingCombustible && !isCreatingCombustible && !selectedCombustibleId" """,
    """<!-- Panel Derecho -->
              <div class="w-full md:w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto flex-col" [ngClass]="{'hidden md:flex': !(isCreatingCombustible || isViewingCombustible || selectedCombustibleId), 'flex': isCreatingCombustible || isViewingCombustible || selectedCombustibleId}">
                <!-- Modo Placeholder -->
                <div *ngIf="!isViewingCombustible && !isCreatingCombustible && !selectedCombustibleId" """
)

# Service Panel Left
content = content.replace(
    """<!-- Lista Izquierda -->
              <div class="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto shadow-sm flex-col" [ngClass]="{'hidden md:flex': isCreatingViaje || isViewingViaje || selectedViajeId, 'flex': !(isCreatingViaje || isViewingViaje || selectedViajeId)}">
                <div *ngFor="let s of services" (click)="verDetalleService(s); selectedService=s" """,
    """<!-- Lista Izquierda -->
              <div class="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto shadow-sm flex-col" [ngClass]="{'hidden md:flex': isCreatingService || selectedService || selectedServiceId, 'flex': !(isCreatingService || selectedService || selectedServiceId)}">
                <div *ngFor="let s of services" (click)="verDetalleService(s); selectedService=s" """
)

# Service Panel Right
content = content.replace(
    """<!-- Panel Derecho -->
              <div class="w-full md:w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto flex-col" [ngClass]="{'hidden md:flex': !(isCreatingViaje || isViewingViaje || selectedViajeId), 'flex': isCreatingViaje || isViewingViaje || selectedViajeId}">
                <!-- Modo Placeholder -->
                <div *ngIf="!selectedService && !isCreatingService && !selectedServiceId" """,
    """<!-- Panel Derecho -->
              <div class="w-full md:w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto flex-col" [ngClass]="{'hidden md:flex': !(isCreatingService || selectedService || selectedServiceId), 'flex': isCreatingService || selectedService || selectedServiceId}">
                <!-- Modo Placeholder -->
                <div *ngIf="!selectedService && !isCreatingService && !selectedServiceId" """
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
