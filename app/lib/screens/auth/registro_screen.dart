// Pantalla de registro de nuevos usuarios para DentoMAX.
// Mismo estilo oscuro minimalista que LoginScreen.

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:dentomax_app/providers/auth_provider.dart';

// ---------------------------------------------------------------------------
// Colores del tema oscuro (compartidos en la carpeta auth)
// ---------------------------------------------------------------------------
const Color _kBackground  = Color(0xFF0A0A0A);
const Color _kSurface     = Color(0xFF141414);
const Color _kInputBg     = Color(0xFF1E1E1E);
const Color _kInputBorder = Color(0xFF2A2A2A);
const Color _kPrimary     = Color(0xFFC41E3A);
const Color _kTextMuted   = Color(0xFF888888);

class RegistroScreen extends StatefulWidget {
  const RegistroScreen({super.key});

  @override
  State<RegistroScreen> createState() => _RegistroScreenState();
}

class _RegistroScreenState extends State<RegistroScreen> {
  final _formKey = GlobalKey<FormState>();

  // Controladores de los campos del formulario
  final _nombreCtrl    = TextEditingController();
  final _emailCtrl     = TextEditingController();
  final _passwordCtrl  = TextEditingController();
  final _confirmCtrl   = TextEditingController();

  // Estado de visibilidad de contraseñas
  bool _obscurePassword = true;
  bool _obscureConfirm  = true;

  @override
  void dispose() {
    _nombreCtrl.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  // -------------------------------------------------------------------------
  // Acción: crear cuenta
  // -------------------------------------------------------------------------
  Future<void> _handleRegister(BuildContext context) async {
    if (!_formKey.currentState!.validate()) return;

    final auth = context.read<AuthProvider>();

    await auth.register(
      _nombreCtrl.text.trim(),
      _emailCtrl.text.trim(),
      _passwordCtrl.text,
    );

    if (auth.error != null && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(auth.error!),
          backgroundColor: _kPrimary,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
    // La navegación al home la maneja AuthProvider vía go_router redirect.
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _kBackground,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
          child: ConstrainedBox(
            // Ancho máximo 420px — layout web centrado
            constraints: const BoxConstraints(maxWidth: 420),
            child: Card(
              color: _kSurface,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: const BorderSide(color: _kInputBorder),
              ),
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // -------------------------------------------------------
                    // Logo universidad (con fallback a texto)
                    // -------------------------------------------------------
                    SizedBox(
                      height: 48,
                      child: Image.asset(
                        'assets/images/logo.png',
                        height: 48,
                        fit: BoxFit.contain,
                        errorBuilder: (_, __, ___) => Text(
                          'Universidad de Talca',
                          style: TextStyle(color: _kTextMuted, fontSize: 13),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // -------------------------------------------------------
                    // Branding DentoMAX
                    // -------------------------------------------------------
                    const Text(
                      'DentoMAX',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: _kPrimary,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Crear nueva cuenta',
                      style: TextStyle(color: _kTextMuted, fontSize: 13),
                    ),
                    const SizedBox(height: 32),

                    // -------------------------------------------------------
                    // Formulario de registro
                    // -------------------------------------------------------
                    Consumer<AuthProvider>(
                      builder: (context, auth, _) {
                        return Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              // Campo nombre completo
                              _DarkTextFormField(
                                controller: _nombreCtrl,
                                label: 'Nombre completo',
                                hint: 'Ej: María González',
                                enabled: !auth.isLoading,
                                validator: (v) {
                                  if (v == null || v.trim().isEmpty) {
                                    return 'Ingresa tu nombre';
                                  }
                                  if (v.trim().length < 3) {
                                    return 'Mínimo 3 caracteres';
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 14),

                              // Campo email
                              _DarkTextFormField(
                                controller: _emailCtrl,
                                label: 'Correo electrónico',
                                hint: 'ejemplo@utalca.cl',
                                keyboardType: TextInputType.emailAddress,
                                enabled: !auth.isLoading,
                                validator: (v) {
                                  if (v == null || v.isEmpty) {
                                    return 'Ingresa tu correo';
                                  }
                                  final emailRegex = RegExp(
                                      r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
                                  if (!emailRegex.hasMatch(v.trim())) {
                                    return 'Correo inválido';
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 14),

                              // Campo contraseña con toggle
                              _DarkTextFormField(
                                controller: _passwordCtrl,
                                label: 'Contraseña',
                                hint: 'Mínimo 6 caracteres',
                                obscureText: _obscurePassword,
                                enabled: !auth.isLoading,
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _obscurePassword
                                        ? Icons.visibility_off_outlined
                                        : Icons.visibility_outlined,
                                    color: _kTextMuted,
                                    size: 20,
                                  ),
                                  onPressed: () => setState(() =>
                                      _obscurePassword = !_obscurePassword),
                                ),
                                validator: (v) {
                                  if (v == null || v.isEmpty) {
                                    return 'Ingresa una contraseña';
                                  }
                                  if (v.length < 6) {
                                    return 'Mínimo 6 caracteres';
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 14),

                              // Campo confirmar contraseña con toggle
                              _DarkTextFormField(
                                controller: _confirmCtrl,
                                label: 'Confirmar contraseña',
                                hint: '••••••••',
                                obscureText: _obscureConfirm,
                                enabled: !auth.isLoading,
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _obscureConfirm
                                        ? Icons.visibility_off_outlined
                                        : Icons.visibility_outlined,
                                    color: _kTextMuted,
                                    size: 20,
                                  ),
                                  onPressed: () => setState(
                                      () => _obscureConfirm = !_obscureConfirm),
                                ),
                                validator: (v) {
                                  if (v == null || v.isEmpty) {
                                    return 'Confirma tu contraseña';
                                  }
                                  if (v != _passwordCtrl.text) {
                                    return 'Las contraseñas no coinciden';
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 24),

                              // Botón "Crear cuenta" o indicador de carga
                              auth.isLoading
                                  ? const Center(
                                      child: CircularProgressIndicator(
                                        color: _kPrimary,
                                        strokeWidth: 2,
                                      ),
                                    )
                                  : ElevatedButton(
                                      onPressed: () =>
                                          _handleRegister(context),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.white,
                                        foregroundColor: Colors.black,
                                        minimumSize:
                                            const Size(double.infinity, 48),
                                        shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(8),
                                        ),
                                        elevation: 0,
                                      ),
                                      child: const Text(
                                        'Crear cuenta',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 15,
                                        ),
                                      ),
                                    ),
                              const SizedBox(height: 20),

                              // Link "¿Ya tienes cuenta? Inicia sesión"
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Text(
                                    '¿Ya tienes cuenta? ',
                                    style: TextStyle(
                                        color: _kTextMuted, fontSize: 13),
                                  ),
                                  GestureDetector(
                                    onTap: auth.isLoading
                                        ? null
                                        : () => context.go('/login'),
                                    child: const Text(
                                      'Inicia sesión',
                                      style: TextStyle(
                                        color: _kPrimary,
                                        fontSize: 13,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Widget reutilizable: TextFormField estilo oscuro
// ---------------------------------------------------------------------------
class _DarkTextFormField extends StatelessWidget {
  const _DarkTextFormField({
    required this.controller,
    required this.label,
    this.hint,
    this.keyboardType,
    this.obscureText = false,
    this.enabled = true,
    this.suffixIcon,
    this.validator,
  });

  final TextEditingController controller;
  final String label;
  final String? hint;
  final TextInputType? keyboardType;
  final bool obscureText;
  final bool enabled;
  final Widget? suffixIcon;
  final String? Function(String?)? validator;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      enabled: enabled,
      style: const TextStyle(color: Colors.white, fontSize: 14),
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        labelStyle: const TextStyle(color: _kTextMuted, fontSize: 13),
        hintStyle: const TextStyle(color: _kInputBorder, fontSize: 13),
        filled: true,
        fillColor: _kInputBg,
        suffixIcon: suffixIcon,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: _kInputBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: _kInputBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: _kPrimary, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: _kPrimary),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: _kPrimary, width: 1.5),
        ),
        errorStyle: const TextStyle(color: _kPrimary, fontSize: 12),
      ),
    );
  }
}
