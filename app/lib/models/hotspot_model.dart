// lib/models/hotspot_model.dart
// Modelo de un punto de interés (hotspot) superpuesto sobre una radiografía.
// Las coordenadas x e y están normalizadas en el rango [0, 100] para ser
// independientes de la resolución de pantalla.

import 'package:flutter/material.dart';

/// Punto interactivo anotado sobre una imagen radiográfica.
class Hotspot {
  /// Identificador único del hotspot.
  final String id;

  /// Posición horizontal normalizada [0–100] (porcentaje del ancho de la imagen).
  final double x;

  /// Posición vertical normalizada [0–100] (porcentaje del alto de la imagen).
  final double y;

  /// Etiqueta corta mostrada en el pin sobre la imagen (p. ej. "Cóndilo").
  final String etiqueta;

  /// Descripción anatómica extendida mostrada al hacer tap en el hotspot.
  final String descripcion;

  /// Color del pin en formato hex string (p. ej. "#C41E3A").
  /// Si es nulo se usa el color primario del tema.
  final String? color;

  const Hotspot({
    required this.id,
    required this.x,
    required this.y,
    required this.etiqueta,
    required this.descripcion,
    this.color,
  });

  // ── Helpers de color ──────────────────────────────────────────────────────

  /// Devuelve el [Color] de Flutter a partir del campo [color] hex.
  /// Si el campo es nulo o inválido retorna el rojo institucional.
  Color get flutterColor {
    if (color == null) return const Color(0xFFC41E3A);
    try {
      final hex = color!.replaceAll('#', '');
      return Color(int.parse('FF$hex', radix: 16));
    } catch (_) {
      return const Color(0xFFC41E3A);
    }
  }

  // ── Serialización ─────────────────────────────────────────────────────────

  /// Construye un [Hotspot] desde el mapa JSON devuelto por la API/CMS.
  factory Hotspot.fromJson(Map<String, dynamic> json) {
    return Hotspot(
      id: json['id'] as String,
      x: (json['x'] as num).toDouble(),
      y: (json['y'] as num).toDouble(),
      etiqueta: json['etiqueta'] as String,
      descripcion: json['descripcion'] as String,
      color: json['color'] as String?,
    );
  }

  /// Convierte el [Hotspot] a un mapa JSON compatible con la API/CMS.
  Map<String, dynamic> toJson() => {
        'id': id,
        'x': x,
        'y': y,
        'etiqueta': etiqueta,
        'descripcion': descripcion,
        if (color != null) 'color': color,
      };

  @override
  String toString() => 'Hotspot(id: $id, etiqueta: $etiqueta, x: $x, y: $y)';
}
