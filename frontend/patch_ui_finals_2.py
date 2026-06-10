import re

file_path = r"c:\Users\JereM\OneDrive\Desktop\Paoloni\frontend\src\app\features\viajes\viajes.component.ts"
try:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
except UnicodeDecodeError:
    with open(file_path, "r", encoding="utf-16") as f:
        content = f.read()

# Combustible Panels
old_left_combustible = """<div class="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto shadow-sm flex-col" [ngClass]="{'hidden md:flex': isCreatingViaje || isViewingViaje || selectedViajeId, 'flex': !(isCreatingViaje || isViewingViaje || selectedViajeId)}">
                <div *ngFor="let c of cargas" (click)="verDetalleCombustible(c); isViewingCombustible=true" """

new_left_combustible = """<div class="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto shadow-sm flex-col" [ngClass]="{'hidden md:flex': isCreatingCombustible || isViewingCombustible || selectedCombustibleId, 'flex': !(isCreatingCombustible || isViewingCombustible || selectedCombustibleId)}">
                <div *ngFor="let c of cargas" (click)="verDetalleCombustible(c); isViewingCombustible=true" """

content = content.replace(old_left_combustible, new_left_combustible)

old_right_combustible = """<!-- Panel Derecho -->
                <div class="w-full md:w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto flex-col" [ngClass]="{'hidden md:flex': !(isCreatingViaje || isViewingViaje || selectedViajeId), 'flex': isCreatingViaje || isViewingViaje || selectedViajeId}">
                  <!-- Modo Placeholder -->
                  <div *ngIf="!isViewingCombustible && !isCreatingCombustible && !selectedCombustibleId" """

new_right_combustible = """<!-- Panel Derecho -->
                <div class="w-full md:w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto flex-col" [ngClass]="{'hidden md:flex': !(isCreatingCombustible || isViewingCombustible || selectedCombustibleId), 'flex': isCreatingCombustible || isViewingCombustible || selectedCombustibleId}">
                  <!-- Modo Placeholder -->
                  <div *ngIf="!isViewingCombustible && !isCreatingCombustible && !selectedCombustibleId" """

content = content.replace(old_right_combustible, new_right_combustible)

# Service Panels
old_left_service = """<div class="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto shadow-sm flex-col" [ngClass]="{'hidden md:flex': isCreatingViaje || isViewingViaje || selectedViajeId, 'flex': !(isCreatingViaje || isViewingViaje || selectedViajeId)}">
                <div *ngFor="let s of services" (click)="verDetalleService(s); selectedService=s" """

new_left_service = """<div class="w-full md:w-1/3 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto shadow-sm flex-col" [ngClass]="{'hidden md:flex': isCreatingService || selectedService || selectedServiceId, 'flex': !(isCreatingService || selectedService || selectedServiceId)}">
                <div *ngFor="let s of services" (click)="verDetalleService(s); selectedService=s" """

content = content.replace(old_left_service, new_left_service)

old_right_service = """<!-- Panel Derecho -->
                <div class="w-full md:w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto flex-col" [ngClass]="{'hidden md:flex': !(isCreatingViaje || isViewingViaje || selectedViajeId), 'flex': isCreatingViaje || isViewingViaje || selectedViajeId}">
                  <!-- Modo Placeholder -->
                  <div *ngIf="!selectedService && !isCreatingService && !selectedServiceId" """

new_right_service = """<!-- Panel Derecho -->
                <div class="w-full md:w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto flex-col" [ngClass]="{'hidden md:flex': !(isCreatingService || selectedService || selectedServiceId), 'flex': isCreatingService || selectedService || selectedServiceId}">
                  <!-- Modo Placeholder -->
                  <div *ngIf="!selectedService && !isCreatingService && !selectedServiceId" """

content = content.replace(old_right_service, new_right_service)

# Elaboracion fixes
file_path_elab = r"c:\Users\JereM\OneDrive\Desktop\Paoloni\frontend\src\app\features\elaboracion\elaboracion.component.ts"
try:
    with open(file_path_elab, "r", encoding="utf-8") as f:
        elab_content = f.read()
except UnicodeDecodeError:
    with open(file_path_elab, "r", encoding="utf-16") as f:
        elab_content = f.read()

elab_content = elab_content.replace(
    """<h5 class="font-bold text-slate-700 uppercase mb-4">Control Molinillo</h5>
                <div class="grid grid-cols-6 gap-4">""",
    """<h5 class="font-bold text-slate-700 uppercase mb-4">Control Molinillo</h5>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">"""
)

elab_content = elab_content.replace(
    """<h5 class="font-bold text-slate-700 uppercase mb-4">Control Molino</h5>
                <div class="flex flex-col space-y-5 md:grid md:grid-cols-2 md:gap-6">""",
    """<h5 class="font-bold text-slate-700 uppercase mb-4">Control Molino</h5>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">"""
)

with open(file_path_elab, "w", encoding="utf-8") as f:
    f.write(elab_content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
