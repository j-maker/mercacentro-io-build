export const Schema = {
  title: 'Stores locator',
  type: 'object',
  properties: {
    title: {
      title: 'Título',
      type: 'string',
      default: 'Nuestras Tiendas'
    },
    google: {
      title: 'google Key',
      type: 'string'
    },
    country: {
      minItems: 0,
      title: 'Pais',
      type: 'array',
      items: {
        title: 'Pais',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Nombre',
            type: 'string'
          },
          department: {
            minItems: 0,
            title: 'Departamentos',
            type: 'array',
            items: {
              title: 'Departamento',
              type: 'object',
              properties: {
                __editorItemTitle: {
                  title: 'Nombre',
                  type: 'string'
                },
                city: {
                  minItems: 0,
                  title: 'Municipio/Ciudad/Provincia',
                  type: 'array',
                  items: {
                    title: 'Municipio/Ciudad',
                    type: 'object',
                    properties: {
                      __editorItemTitle: {
                        title: 'Nombre',
                        type: 'string'
                      },
                      stores: {
                        minItems: 0,
                        title: 'Tiendas/Sucursales',
                        type: 'array',
                        items: {
                          title: 'Tienda',
                          type: 'object',
                          properties: {
                            image: {
                              title: 'Imagen',
                              type: 'string',
                              widget: {
                                'ui:widget': 'image-uploader'
                              }
                            },
                            __editorItemTitle: {
                              title: 'Nombre de la tienda',
                              type: 'string'
                            },
                            type: {
                              title: 'Tipo',
                              type: 'string',
                              description: '(Opcional), ejemplo: Tienda y Centro de Servicio, Centro de Servicio'
                            },
                            address: {
                              title: 'Dirección',
                              type: 'string'
                            },
                            waze: {
                              title: 'Url Waze',
                              type: 'string'
                            },
                            schedule: {
                              title: 'Horario',
                              type: 'string'
                            },
                            lat: {
                              title: 'Latitud',
                              type: 'number'
                            },
                            lng: {
                              title: 'Longitud',
                              type: 'number'
                            },
                            consultant: {
                              title: 'Asesor',
                              type: 'string'
                            },
                            phone: {
                              title: 'Telefono',
                              type: 'string'
                            },
                            email: {
                              title: 'WhatsApp',
                              type: 'string'
                            },
                            local: {
                              title: 'Local',
                              type: 'string'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
