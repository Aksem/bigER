package org.big.erd.ide.launch

import com.google.gson.GsonBuilder
import com.google.inject.Module
import org.eclipse.elk.alg.layered.options.LayeredMetaDataProvider
import org.eclipse.elk.core.util.persistence.ElkGraphResourceFactory
import org.eclipse.emf.ecore.resource.Resource
import org.eclipse.sprotty.layout.ElkLayoutEngine
import org.eclipse.sprotty.server.json.ActionTypeAdapter
import org.eclipse.sprotty.server.json.EnumTypeAdapter
import org.eclipse.sprotty.xtext.EditActionTypeAdapterFactory
import org.eclipse.sprotty.xtext.launch.DiagramLanguageServerSetup
import org.eclipse.sprotty.xtext.ls.SyncDiagramServerModule
import org.eclipse.xtext.ide.server.ServerModule
import org.eclipse.xtext.util.Modules2
// import org.eclipse.xtext.resource.IResourceServiceProvider
// import org.eclipse.elk.alg.force.options.StressMetaDataProvider

class ERDiagramLanguageServerSetup extends DiagramLanguageServerSetup {
	
	override void setupLanguages() {
		// ELK 
		ElkLayoutEngine.initialize(new LayeredMetaDataProvider)
		Resource.Factory.Registry.INSTANCE.extensionToFactoryMap.put('elkg', new ElkGraphResourceFactory)
	}
	
	override GsonBuilder configureGson(GsonBuilder gsonBuilder) {
		val factory = new ActionTypeAdapter.Factory()
		gsonBuilder
			.registerTypeAdapterFactory(factory)
			.registerTypeAdapterFactory(new EditActionTypeAdapterFactory)
			.registerTypeAdapterFactory(new EnumTypeAdapter.Factory)
	}
	
	override Module getLanguageServerModule() {
		Modules2.mixin(
			new ServerModule,
			// for synchronised diagrams
			new SyncDiagramServerModule
		) 
	}
	
}