(function () {
    "use strict";

    function UserGroupEditController($scope, $timeout, $location, $routeParams, usersResource, localizationService) {

        var vm = this;

        vm.loading = false;
        vm.page = {};
        vm.userGroup = {};
        vm.labels = {};

        vm.goToPage = goToPage;
        vm.openSectionPicker = openSectionPicker;
        vm.openContentPicker = openContentPicker;
        vm.openMediaPicker = openMediaPicker;
        vm.openUserPicker = openUserPicker;
        vm.removeSelectedItem = removeSelectedItem;
        vm.getUserStateType = getUserStateType;

        function init() {

            vm.loading = true;

            localizationService.localize("general_cancel").then(function(name){
    	        vm.labels.cancel = name;
            });

            // get user
            usersResource.getUserGroup($routeParams.id).then(function (userGroup) {
                vm.userGroup = userGroup;
                setSectionIcon(vm.userGroup.sections);
                makeBreadcrumbs();
            });

            // fake loading
            $timeout(function () {
                vm.loading = false;
            }, 500);
            
        }

        function goToPage(ancestor) {
            $location.path(ancestor.path).search("subview", ancestor.subView);
        }

        function openSectionPicker() {
            vm.sectionPicker = {
                title: "Select sections",
                view: "sectionpicker",
                selection: vm.userGroup.sections,
                closeButtonLabel: vm.labels.cancel,
                show: true,
                submit: function(model) {
                    vm.sectionPicker.show = false;
                    vm.sectionPicker = null;
                },
                close: function(oldModel) {
                    if(oldModel.selection) {
                        vm.userGroup.sections = oldModel.selection;
                    }
                    vm.sectionPicker.show = false;
                    vm.sectionPicker = null;
                }
            };
        }

        function openContentPicker() {
            vm.contentPicker = {
                title: "Select content start node",
                view: "contentpicker",
                multiPicker: true,
                show: true,
                submit: function(model) {
                    if(model.selection) {
                        vm.userGroup.startNodesContent = model.selection;
                    }
                    vm.contentPicker.show = false;
                    vm.contentPicker = null;
                },
                close: function(oldModel) {
                    vm.contentPicker.show = false;
                    vm.contentPicker = null;
                }
            };
        }

        function openMediaPicker() {
            vm.contentPicker = {
                title: "Select media start node",
                view: "treepicker",
                section: "media",
                treeAlias: "media",
                entityType: "media",
                multiPicker: true,
                show: true,
                submit: function(model) {
                    if(model.selection) {
                        vm.userGroup.startNodesMedia = model.selection;
                    }
                    vm.contentPicker.show = false;
                    vm.contentPicker = null;
                },
                close: function(oldModel) {
                    vm.contentPicker.show = false;
                    vm.contentPicker = null;
                }
            };
        }

        function openUserPicker() {
            vm.userPicker = {
                title: "Select users",
                view: "userpicker",
                selection: vm.userGroup.users,
                show: true,
                submit: function(model) {
                    /*
                    if(model.selection) {
                        vm.userGroup.startNodesMedia = model.selection;
                    }
                    */
                    vm.userPicker.show = false;
                    vm.userPicker = null;
                },
                close: function(oldModel) {
                    vm.userPicker.show = false;
                    vm.userPicker = null;
                }
            };
        }

        function removeSelectedItem(index, selection) {
            selection.splice(index, 1);
        }

        function getUserStateType(state) {
            switch (state) {
                case "disabled" || "umbracoDisabled":
                    return "danger";
                case "pending":
                    return "warning";
                default:
                    return "success";
            }
        }

        function makeBreadcrumbs() {
            vm.breadcrumbs = [
                {
                    "name": "Groups",
                    "path": "/users/users/overview",
                    "subView": "groups"
                },
                {
                    "name": vm.userGroup.name
                }
            ];
        }

        function setSectionIcon(sections) {
            angular.forEach(sections, function(section) {
                section.icon = "icon-section " + section.cssclass;
            });
        }
 
        init();

    }

    angular.module("umbraco").controller("Umbraco.Editors.Users.GroupController", UserGroupEditController);

})();
