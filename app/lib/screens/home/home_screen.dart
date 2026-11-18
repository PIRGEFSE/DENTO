// home_screen.dart
// Pantalla principal con navegación adaptativa:
// - BottomNavigationBar en móvil (ancho < 800px)
// - NavigationRail lateral en web/tablet (ancho >= 800px)

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:dentomax_app/providers/auth_provider.dart';
import 'package:dentomax_app/screens/home/home_tab.dart';
import 'package:dentomax_app/screens/tematicas/tematicas_screen.dart';
import 'package:dentomax_app/screens/multimedia/multimedia_screen.dart';
import 'package:dentomax_app/screens/perfil/perfil_screen.dart';

/// Widget principal de la aplicación tras el login.
/// Gestiona la navegación entre los 4 tabs principales.
class HomeScreen extends StatefulWidget {
  /// Índice del tab inicial (0: Inicio, 1: Temáticas, 2: Multimedia, 3: Perfil)
  final int initialIndex;

  const HomeScreen({super.key, this.initialIndex = 0});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late int _selectedIndex;

  /// Lista de destinos de navegación (label + ícono)
  static const List<_NavDestination> _destinations = [
    _NavDestination(
      label: 'Inicio',
      icon: Icons.home_outlined,
      selectedIcon: Icons.home,
    ),
    _NavDestination(
      label: 'Temáticas',
      icon: Icons.menu_book_outlined,
      selectedIcon: Icons.menu_book,
    ),
    _NavDestination(
      label: 'Multimedia',
      icon: Icons.play_circle_outline,
      selectedIcon: Icons.play_circle,
    ),
    _NavDestination(
      label: 'Mi Perfil',
      icon: Icons.person_outline,
      selectedIcon: Icons.person,
    ),
  ];

  /// Pantallas correspondientes a cada tab
  static const List<Widget> _screens = [
    HomeTab(),
    TematicasScreen(),
    MultimediaScreen(),
    PerfilScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _selectedIndex = widget.initialIndex;
  }

  /// Cambia el tab activo
  void _onDestinationSelected(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Determinar si usar layout web (NavigationRail) o móvil (BottomNav)
        final bool isWide = constraints.maxWidth >= 800;

        if (isWide) {
          return _buildWideLayout(context);
        } else {
          return _buildNarrowLayout(context);
        }
      },
    );
  }

  /// Layout para pantallas anchas (web/tablet): NavigationRail lateral
  Widget _buildWideLayout(BuildContext context) {
    return Scaffold(
      appBar: _buildAppBar(context),
      body: Row(
        children: [
          // NavigationRail lateral
          NavigationRail(
            backgroundColor: const Color(0xFF141414), // superficie
            selectedIndex: _selectedIndex,
            onDestinationSelected: _onDestinationSelected,
            labelType: NavigationRailLabelType.all,
            selectedIconTheme: const IconThemeData(color: Color(0xFFC41E3A)),
            selectedLabelTextStyle: const TextStyle(
              color: Color(0xFFC41E3A),
              fontWeight: FontWeight.bold,
            ),
            unselectedIconTheme: IconThemeData(color: Colors.grey[400]),
            unselectedLabelTextStyle: TextStyle(color: Colors.grey[400]),
            destinations: _destinations.map((dest) {
              return NavigationRailDestination(
                icon: Icon(dest.icon),
                selectedIcon: Icon(dest.selectedIcon),
                label: Text(dest.label),
              );
            }).toList(),
          ),
          // Separador vertical
          const VerticalDivider(
            thickness: 1,
            width: 1,
            color: Color(0xFF2a2a2a),
          ),
          // Contenido del tab seleccionado
          Expanded(
            child: _screens[_selectedIndex],
          ),
        ],
      ),
    );
  }

  /// Layout para pantallas estrechas (móvil): BottomNavigationBar
  Widget _buildNarrowLayout(BuildContext context) {
    return Scaffold(
      appBar: _buildAppBar(context),
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onDestinationSelected,
        type: BottomNavigationBarType.fixed,
        backgroundColor: const Color(0xFF141414),
        selectedItemColor: const Color(0xFFC41E3A),
        unselectedItemColor: Colors.grey[500],
        selectedFontSize: 12,
        unselectedFontSize: 11,
        items: _destinations.map((dest) {
          return BottomNavigationBarItem(
            icon: Icon(dest.icon),
            activeIcon: Icon(dest.selectedIcon),
            label: dest.label,
          );
        }).toList(),
      ),
    );
  }

  /// AppBar compartida: logo "DentoMAX" en rojo + avatar del usuario
  PreferredSizeWidget _buildAppBar(BuildContext context) {
    return AppBar(
      backgroundColor: const Color(0xFF141414),
      elevation: 0,
      title: const Text(
        'DentoMAX',
        style: TextStyle(
          color: Color(0xFFC41E3A), // rojo primario
          fontWeight: FontWeight.bold,
          fontSize: 22,
          letterSpacing: 1.2,
        ),
      ),
      actions: [
        // Avatar del usuario con inicial del nombre
        Consumer<AuthProvider>(
          builder: (context, auth, _) {
            final nombre = auth.usuario?.nombre ?? 'U';
            final inicial = nombre.isNotEmpty ? nombre[0].toUpperCase() : 'U';
            return Padding(
              padding: const EdgeInsets.only(right: 16.0),
              child: GestureDetector(
                onTap: () {
                  // Navegar al tab de perfil al tocar el avatar
                  _onDestinationSelected(3);
                },
                child: CircleAvatar(
                  backgroundColor: const Color(0xFFC41E3A),
                  radius: 18,
                  child: Text(
                    inicial,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}

/// Modelo interno para los destinos de navegación
class _NavDestination {
  final String label;
  final IconData icon;
  final IconData selectedIcon;

  const _NavDestination({
    required this.label,
    required this.icon,
    required this.selectedIcon,
  });
}
