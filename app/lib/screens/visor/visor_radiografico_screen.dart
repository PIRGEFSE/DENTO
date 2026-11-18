// visor_radiografico_screen.dart
// Pantalla central del visor radiográfico con soporte de hotspots interactivos.
// Recibe radiografiaId via GoRouter params. Soporta web (layout doble columna)
// y móvil (imagen arriba + DraggableScrollableSheet abajo).

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

import '../../models/models.dart';
import '../../providers/contenido_provider.dart';
import 'hotspot_pin_widget.dart';
import 'hotspot_info_panel.dart';

class VisorRadiograficoScreen extends StatefulWidget {
  /// ID de la radiografía a mostrar (viene de GoRouter path params).
  final String radiografiaId;

  const VisorRadiograficoScreen({super.key, required this.radiografiaId});

  @override
  State<VisorRadiograficoScreen> createState() =>
      _VisorRadiograficoScreenState();
}

class _VisorRadiograficoScreenState extends State<VisorRadiograficoScreen> {
  /// Hotspot actualmente seleccionado (null = ninguno).
  Hotspot? _hotspotSeleccionado;

  /// Controlador para el InteractiveViewer (zoom + paneo – CU-06).
  final TransformationController _transformController =
      TransformationController();

  /// Clave para medir las dimensiones del contenedor de la imagen.
  final GlobalKey _imageContainerKey = GlobalKey();

  @override
  void dispose() {
    _transformController.dispose();
    super.dispose();
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  /// Selecciona un hotspot y muestra su info (panel lateral en web,
  /// BottomSheet en móvil – CU-08, CU-09).
  void _seleccionarHotspot(BuildContext context, Hotspot hotspot, bool isWeb) {
    setState(() => _hotspotSeleccionado = hotspot);

    if (!isWeb) {
      // Móvil: muestra el panel como BottomSheet modal.
      showModalBottomSheet(
        context: context,
        backgroundColor: const Color(0xFF141414),
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
        ),
        builder: (_) => HotspotInfoPanel(
          hotspot: hotspot,
          onCerrar: () {
            Navigator.of(context).pop();
            setState(() => _hotspotSeleccionado = null);
          },
        ),
      ).then((_) => setState(() => _hotspotSeleccionado = null));
    }
  }

  /// Resetea el zoom a escala 1.
  void _resetZoom() {
    _transformController.value = Matrix4.identity();
  }

  // ─── Build ────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ContenidoProvider>();

    // Busca la radiografía en el provider.
    final Radiografia? radiografia = provider.tematicaActual?.radiografias
        .where((r) => r.id == widget.radiografiaId)
        .firstOrNull;

    if (radiografia == null) {
      return Scaffold(
        backgroundColor: const Color(0xFF0a0a0a),
        appBar: AppBar(
          backgroundColor: const Color(0xFF141414),
          leading: BackButton(onPressed: () => context.pop()),
          title: const Text('Visor radiográfico'),
        ),
        body: const Center(
          child: CircularProgressIndicator(color: Color(0xFFC41E3A)),
        ),
      );
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        // Web/tablet: ancho ≥ 800 px → layout horizontal.
        final bool isWeb = constraints.maxWidth >= 800;

        return Scaffold(
          backgroundColor: const Color(0xFF0a0a0a),
          appBar: _buildAppBar(context, radiografia),
          body: isWeb
              ? _buildWebLayout(context, radiografia)
              : _buildMobileLayout(context, radiografia),
        );
      },
    );
  }

  // ─── AppBar ──────────────────────────────────────────────────────────────

  AppBar _buildAppBar(BuildContext context, Radiografia radiografia) {
    return AppBar(
      backgroundColor: const Color(0xFF141414),
      elevation: 0,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
        tooltip: 'Volver',
        onPressed: () => context.pop(),
      ),
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            radiografia.titulo,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            radiografia.tipo.name.toUpperCase(),
            style: const TextStyle(
              color: Color(0xFFC41E3A),
              fontSize: 10,
              letterSpacing: 1.2,
            ),
          ),
        ],
      ),
      actions: [
        // Botón para resetear el zoom.
        IconButton(
          icon: const Icon(Icons.zoom_out_map, color: Colors.white70),
          tooltip: 'Restablecer zoom',
          onPressed: _resetZoom,
        ),
        // Contador de hotspots.
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Center(
            child: Chip(
              backgroundColor: const Color(0xFFC41E3A).withOpacity(0.2),
              side: const BorderSide(color: Color(0xFFC41E3A)),
              label: Text(
                '${radiografia.hotspots.length} hotspots',
                style: const TextStyle(
                  color: Color(0xFFC41E3A),
                  fontSize: 12,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ─── Layouts ─────────────────────────────────────────────────────────────

  /// Layout de escritorio/web: imagen (60%) | panel info (40%).
  Widget _buildWebLayout(BuildContext context, Radiografia radiografia) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Imagen con hotspots – 60% del ancho.
        Expanded(
          flex: 6,
          child: _buildImagenConHotspots(context, radiografia, isWeb: true),
        ),
        // Separador vertical.
        Container(width: 1, color: const Color(0xFF2a2a2a)),
        // Panel de información – 40% del ancho.
        Expanded(
          flex: 4,
          child: _hotspotSeleccionado != null
              ? HotspotInfoPanel(
                  hotspot: _hotspotSeleccionado!,
                  onCerrar: () =>
                      setState(() => _hotspotSeleccionado = null),
                )
              : _buildPanelVacio(radiografia),
        ),
      ],
    );
  }

  /// Layout móvil: imagen arriba + DraggableScrollableSheet abajo.
  Widget _buildMobileLayout(BuildContext context, Radiografia radiografia) {
    return Stack(
      children: [
        // Imagen ocupa toda la pantalla.
        Positioned.fill(
          child: _buildImagenConHotspots(context, radiografia, isWeb: false),
        ),
        // Hoja deslizable inferior con lista de hotspots.
        DraggableScrollableSheet(
          initialChildSize: 0.18,
          minChildSize: 0.10,
          maxChildSize: 0.45,
          builder: (ctx, scrollController) {
            return Container(
              decoration: const BoxDecoration(
                color: Color(0xFF141414),
                borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black54,
                    blurRadius: 12,
                    offset: Offset(0, -4),
                  ),
                ],
              ),
              child: ListView(
                controller: scrollController,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  // Tirador visual.
                  Center(
                    child: Container(
                      margin: const EdgeInsets.symmetric(vertical: 8),
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.white24,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  Text(
                    'Hotspots (${radiografia.hotspots.length})',
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 12,
                      letterSpacing: 1,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Lista de hotspots como chips tocables.
                  ...radiografia.hotspots.map(
                    (h) => _buildHotspotListItem(context, h, false),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  // ─── Imagen con Hotspots ─────────────────────────────────────────────────

  /// Área de la imagen radiográfica con zoom/paneo e HotspotPin superpuestos.
  Widget _buildImagenConHotspots(
    BuildContext context,
    Radiografia radiografia, {
    required bool isWeb,
  }) {
    return Container(
      color: Colors.black,
      child: InteractiveViewer(
        transformationController: _transformController,
        // Escala mínima: 0.5×, máxima: 5× (CU-06).
        minScale: 0.5,
        maxScale: 5.0,
        boundaryMargin: const EdgeInsets.all(double.infinity),
        child: LayoutBuilder(
          builder: (ctx, constraints) {
            final double w = constraints.maxWidth;
            final double h = constraints.maxHeight;

            return Stack(
              children: [
                // ── Imagen radiográfica ────────────────────────────────────
                Positioned.fill(
                  child: radiografia.url.isNotEmpty
                      ? Image.network(
                          radiografia.url,
                          fit: BoxFit.contain,
                          color: Colors.white.withOpacity(0.92),
                          colorBlendMode: BlendMode.modulate,
                          errorBuilder: (_, __, ___) =>
                              _buildImagenPlaceholder(),
                        )
                      : _buildImagenPlaceholder(),
                ),

                // ── HotspotPin widgets posicionados por % ─────────────────
                ...radiografia.hotspots.map((hotspot) {
                  // Convierte x%, y% a posición absoluta dentro del contenedor.
                  final double left = (hotspot.x / 100) * w - 12;
                  final double top = (hotspot.y / 100) * h - 12;

                  return Positioned(
                    left: left.clamp(0, w - 24),
                    top: top.clamp(0, h - 24),
                    child: HotspotPin(
                      hotspot: hotspot,
                      isSelected: _hotspotSeleccionado?.id == hotspot.id,
                      onTap: () =>
                          _seleccionarHotspot(context, hotspot, isWeb),
                    ),
                  );
                }),
              ],
            );
          },
        ),
      ),
    );
  }

  /// Placeholder cuando no hay URL de imagen.
  Widget _buildImagenPlaceholder() {
    return Container(
      color: const Color(0xFF0d0d0d),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.panorama_horizontal_select,
              size: 72,
              color: Colors.white12,
            ),
            const SizedBox(height: 12),
            const Text(
              'Radiografía no disponible',
              style: TextStyle(color: Colors.white24, fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }

  // ─── Panel vacío (web) ───────────────────────────────────────────────────

  /// Muestra instrucciones cuando no hay hotspot seleccionado (solo en web).
  Widget _buildPanelVacio(Radiografia radiografia) {
    return Container(
      color: const Color(0xFF141414),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Selecciona un hotspot',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Toca cualquier marcador sobre la radiografía para ver su descripción anatómica.',
            style: TextStyle(color: Colors.white54, fontSize: 13, height: 1.5),
          ),
          const SizedBox(height: 24),
          const Divider(color: Color(0xFF2a2a2a)),
          const SizedBox(height: 16),
          Text(
            'Hotspots disponibles (${radiografia.hotspots.length})',
            style: const TextStyle(
              color: Colors.white38,
              fontSize: 11,
              letterSpacing: 1.1,
            ),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: ListView(
              children: radiografia.hotspots
                  .map((h) => _buildHotspotListItem(context, h, true))
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }

  // ─── Item de lista de hotspot ────────────────────────────────────────────

  Widget _buildHotspotListItem(
      BuildContext context, Hotspot hotspot, bool isWeb) {
    final Color color = Color(
      int.tryParse(
            hotspot.color.replaceFirst('#', '0xFF'),
          ) ??
          0xFFC41E3A,
    );
    final bool isSelected = _hotspotSeleccionado?.id == hotspot.id;

    return GestureDetector(
      onTap: () => _seleccionarHotspot(context, hotspot, isWeb),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? color.withOpacity(0.15) : const Color(0xFF1e1e1e),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected ? color : const Color(0xFF2a2a2a),
          ),
        ),
        child: Row(
          children: [
            // Indicador de color.
            Container(
              width: 10,
              height: 10,
              decoration: BoxDecoration(color: color, shape: BoxShape.circle),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                hotspot.etiqueta,
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.white70,
                  fontSize: 13,
                  fontWeight:
                      isSelected ? FontWeight.w600 : FontWeight.normal,
                ),
              ),
            ),
            Icon(
              Icons.chevron_right,
              color: isSelected ? color : Colors.white24,
              size: 16,
            ),
          ],
        ),
      ),
    );
  }
}
