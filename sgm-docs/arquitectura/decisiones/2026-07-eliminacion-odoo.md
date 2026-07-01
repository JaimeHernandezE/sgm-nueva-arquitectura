# 2026-07 — Eliminación de Odoo como base del stack SGM

**Estado:** Aceptada
**Fecha:** Julio 2026

## Contexto

El SGM se venía desarrollando sobre Odoo 17, con un piloto en 5 municipios (Quilaco, Cochamó, Villarrica, María Pinto, y un quinto) cubriendo 5 módulos (Adquisiciones, Tesorería, Contabilidad, Presupuestos, RRHH/Remuneraciones).

La auditoría QA del módulo de Adquisiciones (65+ ítems documentados) reveló que buena parte del trabajo de corrección clasificado como "Interno" requería una dotación de roles (PO, Analista funcional, Arquitecto, Desarrollador, UX/UI, QA) que el equipo real no tiene — el equipo SGM son 3 personas, con capacidad técnica profunda concentrada en una sola.

Adicionalmente, se identificaron hallazgos de diseño estructural — no solo bugs — como la sobre-generalización de "Modalidad de Compra" y "Resolución de Compra" en un único modelo/vista aplicado indistintamente a las 4 modalidades de compra (Compra Ágil, Convenio Marco, Licitación, Trato Directo), cuando en la práctica cada una requiere campos, validadores y flujos de aprobación propios.

## Decisión

Se descontinúa Odoo como base del stack SGM. Se licita un ERP desde cero, usando como insumo:

- Los BPMN de macroprocesos ya mapeados (sirven como especificación funcional, independiente de la plataforma de implementación).
- La ficha QA de 65+ ítems (cada hallazgo se traduce de "bug a corregir" a "requisito que el sistema nuevo debe cumplir").
- Documentación nueva: modelo entidad-relación (extraído del Odoo actual como insumo, luego rediseñado) y wireframes de baja fidelidad por proceso.

## Consecuencias

- El objetivo de "5 pilotos con 5 módulos funcionando en Odoo para fin de 2026" queda sin vigencia en su forma original — pendiente de redefinir con la jefatura y DM.
- El track de "corrección interna de Odoo" (Interno/Licitación por umbral de complejidad) deja de aplicar tal cual — todo el desarrollo futuro pasa por licitación del ERP nuevo.
- El foco del equipo SGM se redirige a producir especificación de calidad (BPMN, modelo de datos, wireframes) para las bases de licitación, no a desarrollo directo.
- JPL, que ya estaba pensado para construirse directo en el nuevo stack sin pasar por Odoo, mantiene esa definición — a evaluar si se adelanta en el roadmap.

## Este repositorio

Este repositorio de documentación (`sgm-docs`) nace como consecuencia directa de esta decisión: es el vehículo para producir y versionar la especificación funcional y de datos que alimentará las bases de licitación del ERP nuevo.
