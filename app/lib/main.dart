// main.dart — Punto de entrada principal de la app DentoMAX
// App de anatomía radiográfica maxilofacial para alumnos de odontología - Universidad de Talca

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/date_symbol_data_local.dart';

import 'package:dentomax_app/router/app_router.dart';
import 'package:dentomax_app/theme/app_theme.dart';
import 'package:dentomax_app/providers/auth_provider.dart';
import 'package:dentomax_app/providers/contenido_provider.dart';
import 'package:dentomax_app/providers/progreso_provider.dart';
import 'package:dentomax_app/providers/multimedia_provider.dart';
import 'package:dentomax_app/services/storage_service.dart';

/// Punto de entrada principal de la aplicación.
/// Inicializa los servicios necesarios antes de arrancar la UI.
Future<void> main() async {
  // Asegura que los bindings de Flutter estén listos antes de cualquier operación asíncrona
  WidgetsFlutterBinding.ensureInitialized();

  // Inicializa los datos de localización para español (Chile / Latam)
  await initializeDateFormatting('es_ES', null);

  // Inicializa el servicio de almacenamiento local (shared_preferences)
  final storageService = StorageService();
  await storageService.init();

  runApp(DentomaxApp(storageService: storageService));
}

/// Widget raíz de la aplicación DentoMAX.
/// Configura el árbol de providers y el MaterialApp con GoRouter.
class DentomaxApp extends StatefulWidget {
  /// Servicio de almacenamiento ya inicializado, pasado desde main().
  final StorageService storageService;

  const DentomaxApp({super.key, required this.storageService});

  @override
  State<DentomaxApp> createState() => _DentomaxAppState();
}

class _DentomaxAppState extends State<DentomaxApp> {
  late final AuthProvider _authProvider;

  @override
  void initState() {
    super.initState();
    // Crear AuthProvider aquí para poder llamar autoLogin antes de que el árbol se construya
    _authProvider = AuthProvider(storageService: widget.storageService);
    // Intenta auto-login con el token guardado (si existe)
    _authProvider.tryAutoLogin();
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        // Provider de autenticación — maneja login, logout, estado del usuario
        ChangeNotifierProvider<AuthProvider>.value(value: _authProvider),

        // Provider de contenido temático — carga y gestiona temáticas/radiografías
        ChangeNotifierProvider<ContenidoProvider>(
          create: (_) => ContenidoProvider(),
        ),

        // Provider de progreso del alumno — guarda avance por temática
        ChangeNotifierProxyProvider<AuthProvider, ProgresoProvider>(
          create: (_) => ProgresoProvider(storageService: widget.storageService),
          update: (_, auth, progreso) {
            // Recarga progresos cuando el usuario cambia (login/logout)
            if (auth.usuario != null) {
              progreso?.cargarProgresos(auth.usuario!.id);
            }
            return progreso ?? ProgresoProvider(storageService: widget.storageService);
          },
        ),

        // Provider de multimedia — carga videos e imágenes educativas
        ChangeNotifierProvider<MultimediaProvider>(
          create: (_) => MultimediaProvider(),
        ),
      ],
      child: _AppRouter(),
    );
  }
}

/// Widget interno que construye el MaterialApp.router.
/// Separado para que GoRouter pueda acceder al AuthProvider via context.
class _AppRouter extends StatelessWidget {
  const _AppRouter();

  @override
  Widget build(BuildContext context) {
    // Escucha cambios en AuthProvider para redirigir según estado de auth
    final authProvider = context.watch<AuthProvider>();

    return MaterialApp.router(
      // Metadatos de la app
      title: 'DentoMAX',
      debugShowCheckedModeBanner: false,

      // Tema oscuro dental (fondo #0a0a0a, primario rojo #C41E3A)
      theme: AppTheme.darkTheme,

      // Localización en español
      locale: const Locale('es', 'ES'),

      // Router configurado con GoRouter (guard de autenticación incluido)
      routerConfig: createAppRouter(authProvider),
    );
  }
}
