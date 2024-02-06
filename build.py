import re
import subprocess
from datetime import datetime
import os
import shutil
import time

import re

def increment_version_cyclic(version):
    parts = list(map(int, version.split('.')))
    parts[2] += 1  # Incrementa el parche
    if parts[2] > 9:
        parts[2] = 0
        parts[1] += 1
    if parts[1] > 9:
        parts[1] = 0
        parts[0] += 1
    if parts[0] > 9:
        parts = [0, 0, 0]  # Reinicia si excede 9.9.9, ajusta según necesidad
    return '.'.join(map(str, parts))

def update_version_cyclic_in_file(config_file):
    try:
        with open(config_file, 'r') as file:
            content = file.read()
        
        version_match = re.search(r"version: '(\d+\.\d+\.\d+)'", content)
        if version_match:
            current_version = version_match.group(1)
            new_version = increment_version_cyclic(current_version)
            
            updated_content = re.sub(r"(version: ')\d+\.\d+\.\d+(')", r"\g<1>{}\g<2>".format(new_version), content)
            
            with open(config_file, 'w') as file:
                file.write(updated_content)
            
            print(f"Versión actualizada en {config_file} de {current_version} a {new_version}.")
        else:
            print(f"No se encontró la versión en {config_file}.")
    except Exception as e:
        print(f"Error al actualizar la versión en {config_file}: {e}")


def update_compilation_date(config_file):
    try:
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        with open(config_file, 'r') as file:
            content = file.read()
            new_content = re.sub(r"(dateCompilation: ')\d{4}-\d{2}-\d{2}(')", rf"\g<1>{current_date}\g<2>", content)
        
        with open(config_file, 'w') as file:
            file.write(new_content)
        
        print(f"Fecha de compilación actualizada en {config_file} a {current_date}")
    except Exception as e:
        print(f"Error al actualizar la fecha de compilación en {config_file}: {e}")

def run_shell_command(command):
    try:
        subprocess.run(command, check=True, shell=True)
        print(f"Comando ejecutado con éxito: {command}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error al ejecutar el comando {command}: {e}")
        return False

def copy_config_and_build(config_source, config_destination='config.js', build_command='npm run build', dist_name='dist.war', new_dist_name=''):
    try:
        # Copiar el nuevo archivo de configuración, reemplazando el existente
        shutil.copy2(config_source, config_destination)
        print(f"Archivo de configuración {config_source} copiado y reemplazado en {config_destination}.")
    except Exception as e:
        print(f"Error al copiar {config_source} a {config_destination}: {e}")
        return False  # Indica que la operación de copia falló

    # Ejecutar el comando de construcción
    if not run_shell_command(build_command):
        return False  # Indica que la operación de construcción falló

    # Esperar a que el archivo dist.war esté disponible
    print("Esperando a que el archivo dist.war esté disponible...")
    time.sleep(1)  # Pausa de 1 segundo

    # Renombrar dist.war si es necesario
    if new_dist_name and os.path.exists(dist_name):
        try:
            os.rename(dist_name, new_dist_name)
            print(f"Archivo {dist_name} renombrado a {new_dist_name}.")
        except Exception as e:
            print(f"Error al renombrar {dist_name} a {new_dist_name}: {e}")
            return False  # Indica que la operación de renombrado falló

    return True  # Indica éxito en todas las operaciones

# Eliminar todos los archivos .war existentes
for war_file in os.listdir('.'):
    if war_file.endswith('.war'):
        os.remove(war_file)
        print(f"Archivo {war_file} eliminado.")

# Actualizar fecha de compilación y construir para cada configuración
configurations = [
    ("config-local-ec.js", "dist-local-ec.war"),
    ("config-local-pe.js", "dist-local-pe.war"),
    ("config-ec.js", "dist-ec.war"),
    ("config-pe.js", "dist-pe.war"),
    ("config-prod-ec-private.js", "IRSConciliacion-ec.war"),
    ("config-prod-ec-public.js", "IRSConciliacion-ec-pub.war")
]

for config_file, new_dist_name in configurations:
    update_compilation_date(config_file)
    update_version_cyclic_in_file(config_file)
    success = copy_config_and_build(config_file, new_dist_name=new_dist_name)
    if not success:
      print(f"Proceso fallido para la configuración {config_file}. Revisar los errores anteriores.")

print("Proceso completado. Presione cualquier tecla para continuar...")
input()
